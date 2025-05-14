import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link, useLocation, useParams } from 'react-router-dom';
import CountryHeroComponent from "../components/CountryHeroComponent";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { menuCountry } from "../features/countryActions";
import { useLayoutEffect } from "preact/hooks";

const MenuContryScreen = () => {
    const location = useLocation()
    const country = location?.state
    const dispatch = useDispatch()
  const{menusCountry, error, loading} = useSelector(state => state.country)
    const {id} = useParams()
    useLayoutEffect(() => {
        document.title = menusCountry?.countryData[0]?.countryName
      }, [menusCountry])
    useEffect( () => {
            dispatch(menuCountry(id)).unwrap()
    }, [dispatch])
    // console.log(menusCountry)
    
  return (
    <div className="mainWrapper notFound"> 
    {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(
    menusCountry?.countryData && menusCountry?.countryData.length !== 0 ? (
        <>
            <div className="countryHero">
                        <img className="countryHeroImg" src={`/assets/flags/${menusCountry && menusCountry?.countryData[0]?.flagCode?.toLowerCase()}.svg`} />
                        <div className="countryHeroText">
                            <h3>{ menusCountry && menusCountry?.countryData[0]?.countryName}</h3>
                        </div>
                    </div>
            {menusCountry?.mealsKategori && menusCountry?.mealsKategori.length !== 0 ? 
                (
                    <>
                    <div className="mealsContainer">      
                        {menusCountry && menusCountry?.mealsKategori?.map((dataCountry, index) => (
                            <div className="mainContainer">      
                                <div className="textHeader withButton">
                                    <h1>{dataCountry.mealsName}</h1>
                                    <Link className="button" to={`/${ menusCountry && menusCountry?.countryData[0].idCountry}/country/${dataCountry?.idMeals}/meal`}>See All</Link>
                                </div>
                                <div className="cardContainer">
                                    {dataCountry?.menu?.map  ((dataCountry) => (
                                        <CardComponent data={dataCountry && dataCountry}></CardComponent>
                                        
                                    )) }            
                                </div>
                            </div>
                        )) }
                    </div>
                </>
            )
            : 
            (
                        <div className="notFoundTtext">
                        <h1>Data Not Found</h1>
                    </div>
                
            )
        }
        </>
    ):(
        <div className="recipeDetail" >
                        <h1>Data Not Found</h1>
                    </div>
    )
    )}   
                
        
        
    </div>
  )
}

export default MenuContryScreen