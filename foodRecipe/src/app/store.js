import { combineReducers, configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../features/recipeSlice";
import countryReducer from "../features/countrySlice";
import userReducer from "../features/userSlice";
import storage from "redux-persist/lib/storage";
// import { injectStore } from "../hooks/useRefreshToken";
import {
    persistReducer, persistStore, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage,
    // safelist: ["auth"],
}
const rootReducer = combineReducers({
    recipe: recipeReducer,
    country: countryReducer,
    user: userReducer
})



const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    // reducer: {
    //     recipe: recipeReducer,
    //     country: countryReducer,
    //     user: userReducer
    // },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: true
})
export const persistor = persistStore(store)
// injectStore(store)

// export default store;