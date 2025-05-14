import React from 'react'
import { Outlet } from "react-router-dom";

function HeroComponent() {
  
  return (
    <>    
        <div className="headerHero">
          
            <div className="layer"></div>
            <img className="headerHeroImg" src={"/assets/images/hero.jpg"} />
            <div className="headerHeroText">

            <h3>SHARE YOUR COUNTRY SIGNATURE FOOD</h3>
                <h3>HERE!</h3>
            </div>
        </div>
    
    </>
  )
}

export default HeroComponent