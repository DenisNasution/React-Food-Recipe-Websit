import { createSlice } from "@reduxjs/toolkit";
import { allCountry, countryList, mealCountry, menuCountry } from "./countryActions";


const initialState = {
    dataCountry: [],
    countryRecipe: [],
    status: false,
    error: "",
    menusCountry: {},
    message: "",
    mealsCountry: [],
    loading: true
}

const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        resetStatus(state, action) {
            state.status = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(countryList.pending, (state, action) => {
            state.loading = true

        })
        builder.addCase(countryList.fulfilled, (state, action) => {
            state.dataCountry = action.payload
            state.loading = false

        })
        builder.addCase(countryList.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(allCountry.fulfilled, (state, action) => {
            state.countryRecipe = action.payload
            state.loading = false
        })
        builder.addCase(allCountry.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(mealCountry.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(mealCountry.fulfilled, (state, action) => {
            state.mealsCountry = action.payload
            state.loading = false
        })
        builder.addCase(mealCountry.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(menuCountry.pending, (state, action) => {
            state.menusCountry = action.payload
            state.loading = true
        })
        builder.addCase(menuCountry.fulfilled, (state, action) => {
            state.menusCountry = action.payload
            state.loading = false
        })
        builder.addCase(menuCountry.rejected, (state, action) => {
            state.menusCountry = {}
            state.message = action.payload
            state.loading = false
        })


    }

})

const { reducer } = countrySlice
export default reducer