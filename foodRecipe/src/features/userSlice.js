import { createSlice } from "@reduxjs/toolkit";
import { forgotPwd, googleLogin, refresh, resetPwd, resetUpdatePwd, testAuth, testLogin, userDetail, userLogin, userLogout, userSignUp, userVerify } from "./userActions";


const initialState = {
    dataUser: [],
    status: "",
    dataStatus: "",
    error: "",
    login: false,
    user: {},
    message: "",
    forgot: false,
    forgotData: {},
    loading: true
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser(state, action) {
            state.status = "";
            state.dataUser = {};
            state.dataStatus = "";
            state.error = "";
            state.login = false;
            state.user = {}
            state.message = ""
            state.forgot = false;
            state.forgotData = {}
        },
        resetStatus(state, action) {
            state.status = "";
        },
        forgotContent(state, action) {
            state.forgot = true;
            state.message = "You should receive an email shortly with further instructions. Don't see it? Be sure to check your spam and junk folders"
        }
    },
    extraReducers: builder => {
        builder.addCase(userDetail.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(userDetail.fulfilled, (state, action) => {
            state.dataUser = action.payload
            state.loading = false
        })
        builder.addCase(userDetail.rejected, (state, action) => {
            state.dataUser = {}
            state.loading = false
            state.dataStatus = action.payload.status
            state.error = action.payload.data.message
        })
        builder.addCase(userSignUp.fulfilled, (state, action) => {
            state.message = action.payload.data.message
            state.status = action.payload.status
        })
        builder.addCase(userSignUp.rejected, (state, action) => {
            state.message = action.payload.data.message
            state.status = action.payload.status
        })
        builder.addCase(userVerify.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(userVerify.fulfilled, (state, action) => {
            state.message = action.payload.data.message
            state.status = action.payload.status
            state.loading = false
        })
        builder.addCase(userVerify.rejected, (state, action) => {
            state.message = action.payload.data.message
            state.status = action.payload.status
            state.loading = false
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.message = ""
            state.status = action.payload.status
            state.login = true
            state.user = action.payload.data
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.message = action.payload.data.message
            state.status = action.payload.status
            state.login = false
        })
        builder.addCase(googleLogin.fulfilled, (state, action) => {
            state.status = true
            state.login = true
            state.user = action.payload
        })
        builder.addCase(googleLogin.rejected, (state, action) => {
            state.error = action.payload
        })
        builder.addCase(userLogout.fulfilled, (state, action) => {
            state.status = "";
            state.dataUser = [];
            state.error = "";
            state.login = false;
            state.user = {}
            state.message = ""
        })
        builder.addCase(userLogout.rejected, (state, action) => {
            state.error = action.payload
        })
        builder.addCase(forgotPwd.fulfilled, (state, action) => {
            state.status = action.payload.status
            state.message = action.payload.data.message
        })
        builder.addCase(forgotPwd.rejected, (state, action) => {
            state.status = action.payload.status
            state.message = action.payload.data.message
        })
        builder.addCase(resetPwd.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(resetPwd.fulfilled, (state, action) => {
            state.forgotData = action.payload.data
            state.message = ""
            state.loading = false
        })
        builder.addCase(resetPwd.rejected, (state, action) => {
            state.status = action.payload.status
            state.message = action.payload.data.message
            state.loading = false
        })
        builder.addCase(resetUpdatePwd.pending, (state, action) => {
            state.loading = true

        })
        builder.addCase(resetUpdatePwd.fulfilled, (state, action) => {
            state.forgotData = {}
            state.loading = false
            state.status = action.payload.status
            state.message = action.payload.data.message
        })
        builder.addCase(resetUpdatePwd.rejected, (state, action) => {
            state.status = action.payload.status
            state.loading = false
            state.message = action.payload.data.message
        })
        builder.addCase(testAuth.fulfilled, (state, action) => {
            state.user = action.payload
            state.login = true
        })
        builder.addCase(testAuth.rejected, (state, action) => {
            state.login = false
            state.error = action.payload.status
        })
        builder.addCase(testLogin.fulfilled, (state, action) => {
            state.user = action.payload
            state.login = true
        })
        builder.addCase(testLogin.rejected, (state, action) => {
            state.login = false
            state.error = action.payload
        })
        builder.addCase(refresh.fulfilled, (state, action) => {
            state.status = true
            state.user = action.payload
            state.login = true
        })
        builder.addCase(refresh.rejected, (state, action) => {
            state.login = false
            state.user = {}
            state.error = action.payload
            // state.status = action.payload.status
            // state.message = action.payload.data.message
        })
    }

})
export const { resetUser, resetStatus, forgotContent } = userSlice.actions
const { reducer } = userSlice
export default reducer