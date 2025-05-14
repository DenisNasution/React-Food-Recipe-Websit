import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link, useParams } from 'react-router-dom';
import CountryHeroComponent from "../components/CountryHeroComponent";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { mealsCategoryDetail } from "../features/recipeActions";
import { useLayoutEffect } from "preact/hooks";

const MealScreen = () => {
    const dispatch = useDispatch()
  const{dataMeals, error, loading} = useSelector(state => state.recipe)
    const {id} = useParams()
    useEffect(() => {
      document.title = dataMeals && dataMeals[0].mealsName
    }, [dataMeals])
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController()

      const getData = async () => {
        dispatch(mealsCategoryDetail(id)).unwrap()
      }
      getData()
      return () => {
          isMounted = false;
          controller.abort()
      }
    }, [])
    console.log(dataMeals)
  return (
    <>
    {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(
              dataMeals.length !== 0 ? (
      <div className="mealsCountryMain">
        <HeroComponent/>
        <div className="mainContainer">      
          <div className="textHeader">
            <h1>{dataMeals && dataMeals[0].mealsName}</h1>
          </div>       
          <div className="cardContainer">
            {dataMeals?.map  ((data) => (        
              <CardComponent data={data}></CardComponent>        
            )) }
        
          </div>
        </div>
      </div>
    ):(
      <>
        <HeroComponent/>
        <div className="mainContainer">
            <h1>{error && error}</h1>
          </div>
      </>
    )
  )}
    
        
    </>
  )
}

export default MealScreen