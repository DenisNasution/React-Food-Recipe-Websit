import { useState, useEffect } from "react";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faUtensils } from "@fortawesome/free-solid-svg-icons";
import {
  useParams,
  redirect,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, editRecipe } from "../features/recipeActions";
import { useRef } from "preact/hooks";
import { resetStatus } from "../features/recipeSlice";
import { allCountry } from "../features/countryActions";
library.add(faUser, faClock, faUtensils);

const AddRecipeScreen = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const dataEdit = location?.state;
  const { status, data, error, message } = useSelector((state) => state.recipe);
  const { login, user } = useSelector((state) => state.user);
  const { countryRecipe } = useSelector((state) => state.country);
  const [success, setSuccess] = useState(false);
  const [menuName, setmenuName] = useState("");
  const [menuDesc, setmenuDesc] = useState("");
  const [meal, setMeal] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [country, setCountry] = useState("");
  const [menuPict, setMenuPict] = useState("");
  const [loading, setLoading] = useState(false);
  const [warnText, setWarnText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [ingredients, setIngredients] = useState([
    { mount: "", ingredientsName: "" },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [file, setFile] = useState("");

  useEffect(() => {
    document.title = "Submit Recipe-Recipe of World";
  }, []);
  useEffect(() => {
    dispatch(allCountry());
    if (dataEdit) {
      setMenuPict(dataEdit.menuPict);
      setmenuName(dataEdit.menuName);
      setmenuDesc(dataEdit.menuDesc);
      setMeal(dataEdit.idMeals);
      setCookTime(dataEdit.cookTime);
      setCountry(dataEdit.idCountry);
      setIngredients(dataEdit.ingredients);
      setInstructions(dataEdit.instruction);
    }
    if (status) {
      setFile("");
      setmenuName("");
      setmenuDesc("");
      setMeal("");
      setCookTime("");
      setCountry("");
      setIngredients([{ mount: "", ingredientsName: "" }]);
      setInstructions([""]);
      setLoading(false);
      navigate(`/recipe/${data.idMenu}`, { replace: true });
    }
    if (error === 500) {
      setLoading(false);
      setWarnText(message);
      dispatch(resetStatus());
    } else if (error === 403) {
      setLoading(false);
      setErrorText(message);
      dispatch(resetStatus());
    }
    dispatch(allCountry());
  }, [status, dataEdit, dispatch, error]);

  const handleIngredientChange = (i, e) => {
    const values = [...ingredients];
    const updateValue = e.target.name;
    values[i][updateValue] = e.target.value;
    setIngredients(values);
  };
  const handleAddIngredient = () => {
    const values = [...ingredients];
    values.push({
      mount: "",
      ingredientsName: "",
    });
    setIngredients(values);
  };
  const handleRemoveIngredient = (index) => {
    const values = [...ingredients];
    values.splice(index, 1);
    setIngredients(values);
  };
  const handleInstructionChange = (i, e) => {
    const values = [...instructions];
    const updateValue = e.target.name;
    values[i] = e.target.value;
    setInstructions(values);
  };
  const handleAddInstruction = () => {
    const values = [...instructions];
    values.push("");
    setInstructions(values);
  };
  const handleRemoveInstruction = (index) => {
    const values = [...instructions];
    values.splice(index, 1);
    setInstructions(values);
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("menuName", menuName);
    form.append("upload", file);
    form.append("menuDesc", menuDesc);
    form.append("idUser", user.idUser);
    form.append("idMeals", meal);
    form.append("cookTime", cookTime);
    form.append("idCountry", country);
    form.append("ingredient", JSON.stringify(ingredients));
    form.append("instruction", JSON.stringify(instructions));
    if (dataEdit) {
      form.append("menuPict", dataEdit.menuPict);
      dispatch(
        editRecipe({ data: { form, idMenu: dataEdit.idMenu } })
      ).unwrap();
    } else {
      dispatch(addRecipe(form)).unwrap();
    }
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className='recipeDetail mainWrapper'>
      <div className='boxShadow'>
        <div className='recipeDetailContainer formContainer'>
          <form action='' onSubmit={handleSumbit}>
            <div className='formInput'>
              {errorText ? (
                <div className='textWarnInput'>
                  <h5>{errorText}</h5>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className='formInput'>
              <label htmlFor='menuName'>Menu Name</label>
              <input
                required
                type='text'
                id='menuName'
                name='menuName'
                onChange={(e) => setmenuName(e.target.value)}
                value={menuName}
              ></input>
            </div>
            <div className='formInput'>
              <label htmlFor='menuDesc'>Menu Description</label>
              <textarea
                required
                type='text'
                id='menuDesc'
                name='menuDesc'
                onClick={() => setWarnText("")}
                onChange={(e) => setmenuDesc(e.target.value)}
                value={menuDesc}
                rows='5'
              ></textarea>
            </div>
            <div className='formInput formPict'>
              <label htmlFor='menuPict'>
                Menu Picture{" "}
                {warnText ? (
                  <div className='textWarnInput'>
                    <h5>{warnText}</h5>
                  </div>
                ) : (
                  ""
                )}
              </label>
              <div className='menuPictContainer'>
                <input
                  required={!dataEdit}
                  type='file'
                  id='menuPict'
                  name='menuPict'
                  accept='.jpg,.png,.jpeg'
                  onChange={(e) => {
                    handleFile(e);
                    setWarnText("");
                    setLoading(false);
                  }}
                ></input>
              </div>
            </div>
            <div className='formInput dropDownTime'>
              <div id='mealTypes'>
                <label htmlFor='mealType'>Meals Type</label>
                <select
                  required
                  name='mealType'
                  id='mealType'
                  onChange={(e) => setMeal(e.target.value)}
                  value={meal}
                >
                  <option value=''>--Select Meal--</option>
                  <option value='1'>Appetizer</option>
                  <option value='2'>Main Dish</option>
                  <option value='3'>Dessert</option>
                </select>
              </div>
              <div id='cookTimes'>
                <label htmlFor='cookTime'>Cook Time</label>
                <input
                  required
                  type='number'
                  name='cookTime'
                  id='cookTime'
                  min={0}
                  onChange={(e) => setCookTime(e.target.value)}
                  value={cookTime}
                ></input>
              </div>
              <div id='countrys'>
                <label htmlFor='country'>Country</label>
                <select
                  required
                  name='country'
                  id='country'
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                >
                  <option value=''>--Select Country--</option>
                  {countryRecipe?.map((country) => (
                    <option
                      value={country.idCountry}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100px",
                      }}
                    >
                      {country.countryName.substr(0, 26)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='formInput'>
              <label htmlFor='ingredient'>Ingredients</label>
              {ingredients.map((ingredient, index) => (
                <div className='in'>
                  <div className='amountNumber'>
                    <input
                      required
                      type='text'
                      name='mount'
                      id='mount'
                      placeholder='mount(e.g.2clv)'
                      value={ingredient.mount}
                      onChange={(e) => handleIngredientChange(index, e)}
                    />
                  </div>
                  <input
                    required
                    type='text'
                    id='ingredientsName'
                    name='ingredientsName'
                    value={ingredient.ingredientsName}
                    onChange={(e) => handleIngredientChange(index, e)}
                  ></input>
                  {ingredients.length === 1 ? (
                    <h3 onClick={() => handleAddIngredient()}>+</h3>
                  ) : ingredients[index] ===
                    ingredients[ingredients.length - 1] ? (
                    <h3 onClick={() => handleAddIngredient()}>+</h3>
                  ) : (
                    <h3 onClick={() => handleRemoveIngredient(index)}>-</h3>
                  )}
                </div>
              ))}
            </div>
            <div className='formInput'>
              <label htmlFor='instruction'>Instructions</label>
              {instructions.map((instruction, index) => (
                <div className='in'>
                  <textarea
                    required
                    type='text'
                    id='instruction'
                    name='instruction'
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e)}
                    rows='3'
                  ></textarea>
                  {instructions.length === 1 ? (
                    <h3 onClick={() => handleAddInstruction()}>+</h3>
                  ) : instructions[index] ===
                    instructions[instructions.length - 1] ? (
                    <h3 onClick={() => handleAddInstruction()}>+</h3>
                  ) : (
                    <h3 onClick={() => handleRemoveInstruction(index)}>-</h3>
                  )}
                </div>
              ))}
            </div>
            <div className='buttons'>
              <button type='submit' className='saveButton' disabled={loading}>
                {loading && <div className='loader'></div>}
                Save Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeScreen;
