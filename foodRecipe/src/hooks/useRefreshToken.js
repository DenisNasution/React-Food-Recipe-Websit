import axios from "axios";
import { refresh } from "../features/userActions";
let store

export const injectStore = _store => {
    store = _store
}
export const axiosPrivate = axios.create({
    baseURL: process.env.BASE_URL,
    headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});
const NO_RETRY_HEADER = 'x-no-retry'
axiosPrivate.interceptors.request.use(
    config => {
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${store.getState().user.user.accessTokens}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);
axiosPrivate.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 || error?.response?.status === 401) {
            if (error.config.headers && error.config.headers[NO_RETRY_HEADER]) {
                return Promise.reject(error)
            }
            prevRequest.sent = true;
            prevRequest.headers[NO_RETRY_HEADER] = 'true'
            await store.dispatch(refresh())
            prevRequest.headers['Authorization'] = `Bearer ${store.getState().user.user.accessTokens}`;
            return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
    }
);

