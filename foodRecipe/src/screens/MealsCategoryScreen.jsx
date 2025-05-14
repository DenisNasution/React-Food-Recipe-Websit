import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link } from 'react-router-dom';
import CountryHeroComponent from "../components/CountryHeroComponent";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { mealsCategory } from "../features/recipeActions";
import { useLayoutEffect } from "preact/hooks";

const MealsCategoryScreen = () => {
    const dispatch = useDispatch()
  const{dataMeals, error, loading} = useSelector(state => state.recipe)
  useLayoutEffect(() => {
    document.title = "Meals-Recipe of World"
  }, [])
    useEffect(() => {
            dispatch(mealsCategory()).unwrap()
    }, [dispatch])
    const handle = () => {
        dispatch(mealsCategory())
    }
    
    return (
        <div className="mainWrapper">
            <HeroComponent/>
                <div className="mealsContainer">  
                {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):( 
                    dataMeals?.map((data, index) => (
                        <div className="mainContainer">      
                            <div className="textHeader withButton">
                                <h1>{data.mealsName}</h1>
                                <Link className="button" to={`/${data.idMeals}/meal`}>See All</Link>
                            </div>
                            <div className="cardContainer">
                                {data?.menu?.map  ((data) => (
                                    <CardComponent data={data}></CardComponent>
                                )) }            
                            </div>
                        </div>
                    )) 
                    )} 
                </div>
            
        </div>
    )
}

export default MealsCategoryScreen