import { createSlice } from "@reduxjs/toolkit";
import { addRecipe, deleteRecipe, editRecipe, mealsCategory, mealsCategoryDetail, recipeDetail, recipeHomeAction } from "./recipeActions";

const initialState = {
    data: [],
    dataMeals: [],
    status: false,
    statusDelete: false,
    error: "",
    message: "",
    loading: true
}

const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {
        resetStatus(state, action) {
            state.status = false;
            state.statusDelete = false;
            state.message = "";
            state.error = ""
        }
    },
    extraReducers: builder => {
        builder.addCase(recipeHomeAction.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(recipeHomeAction.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(recipeDetail.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(recipeDetail.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(recipeDetail.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(mealsCategory.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(mealsCategory.fulfilled, (state, action) => {
            state.dataMeals = action.payload
            state.loading = false
        })
        builder.addCase(mealsCategory.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(mealsCategoryDetail.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(mealsCategoryDetail.fulfilled, (state, action) => {
            state.dataMeals = action.payload
            state.loading = false
        })
        builder.addCase(mealsCategoryDetail.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(addRecipe.fulfilled, (state, action) => {
            state.status = true
            state.data = action.payload
            state.message = action.payload.message
        })
        builder.addCase(addRecipe.rejected, (state, action) => {
            state.status = false
            state.error = action.payload.status
            state.message = action.payload.data.message
        })
        builder.addCase(editRecipe.fulfilled, (state, action) => {
            state.status = true
            state.data = action.payload
            state.message = action.payload.message
        })
        builder.addCase(editRecipe.rejected, (state, action) => {
            state.status = false
            state.error = action.payload.status
            state.message = action.payload.data.message
        })
        builder.addCase(deleteRecipe.fulfilled, (state, action) => {
            state.statusDelete = true
            state.message = action.payload
        })
        builder.addCase(deleteRecipe.rejected, (state, action) => {
            state.error = action.payload.status
        })

    }

})
export const { resetStatus } = recipeSlice.actions
const { reducer } = recipeSlice
export default reducer