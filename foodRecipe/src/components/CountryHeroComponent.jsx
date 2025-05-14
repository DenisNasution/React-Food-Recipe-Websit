import React from 'react'
import { Outlet } from "react-router-dom";

const CountryHeroComponent = ({country}) => {
    
    return (
        <>    
            <div className="countryHero">
                <img className="countryHeroImg" src={`/assets/flags/${country && country[0].menu[0].flagCode.toLowerCase()}.svg`} />
                <div className="countryHeroText">
                    <h3>{country &&  country[0].menu[0].countryName}</h3>
                </div>
            </div>

        </>
    )
}

export default CountryHeroComponent