import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosPrivate } from "../hooks/useRefreshToken";
axios.defaults.withCredentials = true;
export const recipeHomeAction = createAsyncThunk(
    'recipe/recipeHome',
    async (args, thunkApi) => {
        const response = await axios.get(`${process.env.BASE_URL}/api/recipe/home`, {
            withCredentials: true
        })
        return response.data
    }
)
export const recipeDetail = createAsyncThunk(
    'recipe/recipeDetail',
    async (id, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/${id}`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const mealsCategory = createAsyncThunk(
    'recipe/mealsCategory',
    async (args, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/meals`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const mealsCategoryDetail = createAsyncThunk(
    'recipe/mealsCategoryDetail',
    async (id, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/recipe/${id}/meals`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const addRecipe = createAsyncThunk(
    'recipe/addRecipe',
    async (form, thunkApi) => {
        try {
            const config = { headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' } };
            const response = await axiosPrivate.post(`/api/recipe`, form)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const editRecipe = createAsyncThunk(
    'recipe/editRecipe',
    async ({ data }, thunkApi) => {
        try {
            const config = { headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' } };
            const response = await axiosPrivate.put(`/api/recipe/${data.idMenu}`, data.form, config)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)
export const deleteRecipe = createAsyncThunk(
    'recipe/deleteRecipe',
    async (id, thunkApi) => {
        try {
            const response = await axiosPrivate.delete(`/api/recipe/${id}`)
            return response.data
        } catch (error) {
            return thunkApi.rejectWithValue(error.response)
        }
    }
)

