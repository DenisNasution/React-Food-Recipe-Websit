import React from 'react'
import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link } from 'react-router-dom';
import CardComponent from '../components/CardComponent';
import { useDispatch, useSelector } from 'react-redux';
import { recipeHomeAction } from '../features/recipeActions';

function HomeScreen() {
    const [datas, setData] = useState()
    const dispatch = useDispatch()
    const {data, loading} = useSelector(state => state.recipe)
    const {status, message} = useSelector(state => state.user)
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController()
      dispatch(recipeHomeAction())
      return () => {
          isMounted = false;
          controller.abort()
      }
    }, [dispatch])
    return (
        <>
          <HeroComponent/>
          <div className="mainWrapper">
            {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(
              <>
              <div className="mainContainer">
            
            <div className="textHeader">
              <h1>Country</h1>
            </div>       
            <div className="cardContainer">
              {data?.country?.map  ((data) => (
                <CardComponent data={data}></CardComponent>
              )) }
            </div>
          </div>
          <div className="homeBanner">
            <img className="bannerImage" src={"/assets/recipesAsset/Argentina/chimichurriL.png"} alt="" />
            <h2>Let's Traveling Around the World With The food</h2>
          </div>
          <div className="mealsContainer">      
            <div className="mainContainer">      
              <div className="textHeader">
                <h1>Appetizer</h1>
              </div>
              <div className="cardContainer">
                {data?.appetizer?.map  ((data) => (
                  <CardComponent data={data}></CardComponent>
                  )) 
                }            
              </div>
            </div>
            <div className="mainContainer">      
              <div className="textHeader">
                <h1>Main Corse</h1>
              </div>
              <div className="cardContainer">
                {data?.mainCorse?.map  ((data) => (
                  <CardComponent data={data}></CardComponent>
                  )) 
                }  
              </div>
            </div>
            <div className="mainContainer">      
              <div className="textHeader">
                <h1>Dessert</h1>
              </div>
              <div className="cardContainer">
                {data?.dessert?.map  ((data) => (
                <CardComponent data={data}></CardComponent>
                  )) 
                }  
              </div>
            </div>
          </div>
          <div className="latestContainer">      
            <div className="mainContainer">      
              <div className="textHeader">
                <h1>What's New</h1>
              </div>
              <div className="cardContainer">
                {data?.latest?.map  ((data) => (
                  <CardComponent data={data}></CardComponent>
                ))}  
              </div>
            </div>
          </div> 
            </>
            )}
              
                      
          </div>
    </>
  )
}

export default HomeScreen