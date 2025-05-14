import { useEffect, useState } from "preact/hooks";
import "./app.css";
import LayoutComponent from "./components/LayoutComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import MenuContryScreen from "./screens/MenuContryScreen";
import MealContryScreen from "./screens/MealContryScreen";
import CountryListScreen from "./screens/CountryListScreen";
import MealsCategoryScreen from "./screens/MealsCategoryScreen";
import MealScreen from "./screens/MealScreen";
import UserScreen from "./screens/UserScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import NotFound from "./screens/NotFound";
import LoginScreen from "./screens/LoginScreen";
import RequireAuth from "./screens/RequireAuth";
import VerifyScreen from "./screens/verifyScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotScreen from "./screens/ForgotScreen";
import ResetScreen from "./screens/ResetScreen";

export function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginScreen />}></Route>
        <Route path='/signup' element={<SignupScreen />}></Route>
        <Route path='/forgot' element={<ForgotScreen />}></Route>
        <Route path='/reset' element={<ResetScreen />}></Route>
        <Route path='/' element={<LayoutComponent />}>
          <Route path='*' element={<NotFound />}></Route>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/countryList' element={<CountryListScreen />} />
          <Route path='/mealsCategory' element={<MealsCategoryScreen />} />
          <Route path='addRecipe' element={<AddRecipeScreen />} />
          <Route path='/reqAuth' element={<RequireAuth />}></Route>
          <Route path=':id/user' element={<UserScreen />} />
          <Route path='/verify' element={<VerifyScreen />} />
          <Route path='/recipe/:id' element={<RecipeDetailScreen />} />
          <Route path='/:id/meal' element={<MealScreen />} />
          <Route path='/:id/country' element={<MenuContryScreen />} />
          <Route
            path='/:idCountry/country/:idMeals/meal'
            element={<MealContryScreen />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
