import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link, useParams } from 'react-router-dom';
import CountryHeroComponent from "../components/CountryHeroComponent";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { testAuth, userDetail } from "../features/userActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetStatus } from "../features/recipeSlice";
import { useMemo } from "preact/hooks";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
library.add( faUser)

const UserScreen = () => {
    const dispatch = useDispatch()
    // const [loading, setLoading] = useState(true)
    const{dataUser, error, user, dataStatus, loading} = useSelector(state => state.user)
    const{status, statusDelete, message } = useSelector(state => state.recipe)
    const{id} = useParams()
    

    const notify = () => toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
    useEffect(() => {
      document.title = "Profile - Recipe of World"
    }, [])
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController()

      const getData = async () => {

        dispatch(userDetail(id))
        if (statusDelete) {
          notify()
          dispatch(resetStatus())
        }
      }
      getData()
      return () => {
          isMounted = false;
          controller.abort()
      }
    }, [dispatch, statusDelete])
    
  return (
    <>
    <div className="mealsCountryMain mainWrapper">
      <ToastContainer></ToastContainer>
      {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(
      dataUser && dataUser?.profile ? 
        (
          <>
            <div className="userHero">
              <div className="userAvatar">
                {/* <img className="countryHeroImg" src={`/assets/images/d3.jpeg`} />             */}
                <FontAwesomeIcon className="iconUtil countryHeroImg" icon={faUser} />
              </div>
              <div className="countryHeroText">
                <div className="userDetail">
                  <h3>{dataUser &&  dataUser?.profile?.nameOfUser}</h3>
                  <h4>{dataUser &&  dataUser?.profile?.userName}</h4>
                </div>
              </div>
            </div>
            <div className="mainContainer">     
                {dataUser && dataUser?.userRecipe?.length !== 0 ? 
                (<>
                  <div className="cardContainer">
                      {dataUser?.userRecipe?.map((userRecipe) => (          
                      <CardComponent data={userRecipe}></CardComponent>          
                      ))} 
                  </div>
                </>):(
                  <div className="mainContainer">
                    <h1>Data Not Found</h1>
                </div>
                )
                }
            
            </div>
          </>
        )
        :
        (
          <div className="mainContainer">
            <h1 >Data Not Found</h1>
          </div>
        )
      
      )}        
    </div>
        
    </>
  )
}

export default UserScreen