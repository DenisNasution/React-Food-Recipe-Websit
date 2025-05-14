import { useState, useEffect } from "react";
import  axios  from "axios";
import { Link, useNavigate, useParams  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRecipe, recipeDetail } from "../features/recipeActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { testAuth } from "../features/userActions";
import { resetStatus as resetStatusUser } from "../features/userSlice";
import { resetStatus } from "../features/recipeSlice";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUser, faUtensils, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import ModalComponent from "../components/ModalComponent";
library.add( faUser, faClock, faUtensils, faPenToSquare, faTrash)

const RecipeDetailScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false);
  const{data, error, status, statusDelete, message} = useSelector(state => state.recipe)
  const{login, user} = useSelector(state => state.user)
  let {id} = useParams();
  const notify = () => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
  useEffect(() => {
    document.title = "Recipe Detail-Recipe of World"  }, [])
  useEffect(() => {
      let isMounted = true;
      const controller = new AbortController()
      dispatch(testAuth())
      if(!login){
        dispatch(resetStatusUser())
      }
      dispatch(recipeDetail(id)).unwrap()
      if(statusDelete){
        navigate(`/${user.idUser}/user/`, {replace: true})
      }
      if (status) {
        notify()
        dispatch(resetStatus())
      }
      if(error === 401){
        navigate('/login', {replace: true})
      }
  }, [ dispatch, statusDelete, login,])
  
  const deleteHandler = ( idMenu) => {
    // e.preventDefault()
      dispatch(deleteRecipe(id)).unwrap()
      // console.log(idMenu)
  }
  return (
    <div className='recipeDetail mainWrapper'>
      <ToastContainer></ToastContainer>
        {data.length!== 0 ? 
          (
            <div className="boxShadow">
              <div className="recipeDetailContainer">
              <img className="recipeImage" src={process.env.BASE_URL+data?.menuPict} alt="" />
              <div className="contentContainer">
              <div className="recipeContent">
                {login && user && user.idUser === data.idUser &&(
                  <div className="buttonGroup">
                    <Link className="updateButton" to='/addRecipe' state = {data && data} ><FontAwesomeIcon icon={faPenToSquare} /> Edit </Link>
                    {/* <button className="deleteButton" onClick={(e) => deleteHandler(e, data?.idMenu)}><FontAwesomeIcon icon={faTrash} /> Delete </button> */}
                    <button className="deleteButton" onClick={() => setModalOpen(true)}><FontAwesomeIcon icon={faTrash} /> Delete </button>
                </div>
                )}
                
                <div className="menuDetails">
                  <h3 className="menuName">{data?.menuName}</h3>
                  <div className="menuUtils">
                    <div className="utils">
                      <FontAwesomeIcon className="iconUtil"  icon={faClock} />
                      <p>{data?.cookTime}</p>
                    </div>
                    <div className="utils">
                      <FontAwesomeIcon className="iconUtil" icon={faUser} />
                      <p>{data?.userName}</p>
                    </div>
                    <div className="utils">
                      <FontAwesomeIcon className="iconUtil" icon={faUtensils} />
                      <p>{data?.meals}</p>
                    </div>
                  </div>
                </div>
                  <div className="menuDescription">
                    <p>
                      {data?.menuDesc}
                    </p>
                  </div>
                  <h3>How To Make</h3>
                  <div className="recipeIngredient Todo">
                    <h2>Ingredients</h2>
                    <ul>
                    {data?.ingredients?.map((ingredient) => (
                      <li>{`${ingredient.mount} ${ingredient.ingredientsName}`} </li>
                    ))}
                    
                    </ul>
                  </div>
                  <div className="recipeInstruction Todo">
                    <h2>Instruction</h2>
                    <ul>
                    {data?.instruction?.map((instruction) => (
                      <li>{instruction} </li>
                    ))}
                    </ul>
                  </div>
              </div>
              <div className="countryDetail">
                <div className="flag">

              <img src={`/assets/flags/${data?.flagCode?.toLowerCase()}.svg`} alt="" />
              <h5>{data?.countryName}</h5>
                </div>
              </div>
              </div>

              </div>
              <div>

                {isModalOpen && (
                  <ModalComponent onClose={() => setModalOpen(false)} onDelete = {() => deleteHandler(data?.idMenu)} data= {data?.idMenu}>
                    <h2>Delete Confirmation</h2>
                    <p>Are you want to delete?</p>
                  </ModalComponent>
                )}
              </div>
              
            </div>
          ):
          (
            <div className="">
              <h1>{error && error}</h1>
            </div>
          )
        }
    </div>
  )
}

export default RecipeDetailScreen