import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const countryList = createAsyncThunk(
    'country/countryList',
    async (page, thunkApi) => {

        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/country?page=${page}&pageSize=30`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)
export const allCountry = createAsyncThunk(
    'country/allCountry',
    async (page, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/country/allcountry`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)
export const menuCountry = createAsyncThunk(
    'country/menuCountry',
    async (id, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/${id}/country`)

            return response.data

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)
export const mealCountry = createAsyncThunk(
    'country/mealCountry',
    async ({ idCountry, idMeals }, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/${idCountry}/country/${idMeals}/meals`)

            return response.data

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.message)
        }
    }
)