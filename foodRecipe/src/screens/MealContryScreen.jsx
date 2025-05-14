import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link, useParams } from 'react-router-dom';
import CountryHeroComponent from "../components/CountryHeroComponent";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { mealCountry } from "../features/countryActions";
import { useLayoutEffect } from "preact/hooks";

const MealContryScreen = () => {
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState()
    const dispatch = useDispatch()
  const{mealsCountry, error, loading} = useSelector(state => state.country)
    const{idCountry, idMeals} = useParams()

    useLayoutEffect(() => {
      document.title = `${mealsCountry &&  mealsCountry[0].countryName} ${mealsCountry && mealsCountry[0].meal}-Recipe of World`
    }, [mealsCountry])
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController()

      const getData = async () => {
        dispatch(mealCountry({idCountry, idMeals})).unwrap()
      }
      getData()
      return () => {
          isMounted = false;
          controller.abort()
      }
    }, [dispatch])
    
  return (
    <>
      <div className="mealsCountryMain mainWrapper">
      {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(
        mealsCountry.length !== 0 ? 
          (
            <>
              <div className="countryHero mealCountryHero ">
                      <img className="countryHeroImg" src={`/assets/flags/${mealsCountry && mealsCountry[0].flagCode?.toLowerCase()}.svg`} />
                      <div className="countryHeroText">
                          <h3>{mealsCountry &&  mealsCountry[0].countryName}</h3>
                      </div>
              </div>
              <div className="mainContainer">      
                <div className="textHeader">
                  <h1>{mealsCountry && mealsCountry[0].meal}</h1>
                </div>       
                <div className="cardContainer">
                  {mealsCountry?.map  ((mealsCountry) => (
                    <CardComponent data={mealsCountry}></CardComponent>                  
                  )) }
              
                </div>
              </div>
            </>
          )
          :
          (
            <div className="mainContainer">
              <h1 h1>{error && error}</h1>
            </div>
          )
          )} 
        
          
      </div>
        
    </>
  )
}

export default MealContryScreen