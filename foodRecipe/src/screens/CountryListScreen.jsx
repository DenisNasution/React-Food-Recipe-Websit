import React from 'react'
import { useState, useEffect } from "react";
import  axios  from "axios";
import HeroComponent from '../components/HeroComponent';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { countryList } from '../features/countryActions';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
library.add( faBackward, faForward)

function CountryListScreen() {
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch()
  const{dataCountry, error, loading} = useSelector(state => state.country)

  useEffect(() => {
    document.title = "Country List-Recipe of World"
  }, [])
    useEffect(() => {
      dispatch(countryList(currentPage)).unwrap()
      
    }, [currentPage])

    const handlePrevPage = (currentPage) => {
      if (currentPage > 1) {
        setCurrentPage(currentPage- 1);
      }
      else if (currentPage = 1) {
        setCurrentPage(1);
      }
    };
  
    const handleNextPage = (currentPage) => {
      if (currentPage < dataCountry.totalPages) {
        setCurrentPage(currentPage + 1);
      }
      else if (currentPage = dataCountry.totalPages) {
        setCurrentPage(currentPage );
      }
    };
    return (
        <>
        <HeroComponent/>
    <div className="mainWrapper">
      <div className="mainContainer">      
        <div className="textHeader">
          <h1>Country</h1>
        </div>       
        <div className="countryContainer">
          {dataCountry?.country?.map((dataCountry) => (
            <Link className='countryLink' to={`/${dataCountry.idCountry}/country`} state={dataCountry && dataCountry }>
              <div className="countryContent">
                <img src={`/assets/flags/${dataCountry?.flagCode?.toLowerCase()}.svg`} alt="" />
                <h5>{dataCountry.countryName}</h5>
              </div>
            </Link>
          ))}
          
        </div>
        <div className="pagination">
            <button onClick={() => handlePrevPage(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => handlePrevPage(currentPage)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faBackward} />
            </button>
            <button onClick={() => handleNextPage(currentPage)} disabled={currentPage === dataCountry.totalPages}>
            <FontAwesomeIcon icon={faForward} />
            </button>
            <button onClick={() => handleNextPage(dataCountry.totalPages)} disabled={currentPage === dataCountry.totalPages}>
              Last
            </button>
        </div>
      </div>
              
    </div>
    </>
    )
}

export default CountryListScreen