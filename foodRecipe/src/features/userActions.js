import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosPrivate } from "../hooks/useRefreshToken";
export const userDetail = createAsyncThunk(
    'user/userDetail',
    async (idUser, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/${idUser}/user`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const userLogin = createAsyncThunk(
    'user/userLogin',
    async (user, thunkApi) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/user/signin`, { userName: user.userName, userPassword: user.password })
            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const userSignUp = createAsyncThunk(
    'user/userSignUp',
    async (user, thunkApi) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/user/register`, { userName: user.userName, userPassword: user.password, userEmail: user.userEmail, nameOfUser: user.nameOfUser })

            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const userVerify = createAsyncThunk(
    'user/userVerify',
    async (user, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/user/verify/${user}`)

            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const userLogout = createAsyncThunk(
    'user/userLogout',
    async (user, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/user/signout`)
            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (user, thunkApi) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/user/google-login`, { jwt: user })
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)
export const testAuth = createAsyncThunk(
    'user/testAuth',
    async (user, thunkApi) => {
        try {
            const response = await axiosPrivate.get(`/api/user/test`)
            return response.data
        } catch (error) {
            // console.clear()
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const testLogin = createAsyncThunk(
    'user/testLogin',
    async (user, thunkApi) => {
        try {
            const response = await axiosPrivate.get(`/api/user/test1`)
            return response.data
        } catch (error) {
        }
    }
)
export const refresh = createAsyncThunk(
    'user/refresh',
    async (user, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/user/refresh`)
            // console.clear()
            return response.data
            // console.log(response)
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.status)
        }
    }
)
export const forgotPwd = createAsyncThunk(
    'user/forgotPwd',
    async (userEmail, thunkApi) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/user/forgotPwd`, { userEmail: userEmail })
            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const resetPwd = createAsyncThunk(
    'user/resetPwd',
    async (unique, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/user/reset/${unique}`)
            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const resetUpdatePwd = createAsyncThunk(
    'user/resetUpdatePwd',
    async (data, thunkApi) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/user/reset/update`, { idUser: data.idUser, userPassword: data.userPassword })
            return response
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
