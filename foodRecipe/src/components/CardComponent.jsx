import React from 'react'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
library.add( faUser)

const CardComponent = ({data}) => {
    
    return (
        <>
            <div className="cardMenu">        
                <img className="cardImage" src={`${process.env.BASE_URL}/thumbnail${data?.menuPict}`} alt="" />
                <div className="cardDetail">
                    <Link className='userLink' to={`/${data?.idUser}/user`}>
                        <div className="userPic">
                            {/* <img className="countryHeroImg" src={`/assets/images/d3.jpeg`} />  */}
                            <FontAwesomeIcon className="iconUtil countryHeroImg" icon={faUser} />
                        </div>
                        <h5>{data && data?.userName?.substring(0,8)}</h5>
                    </Link>
                    <Link className='flagLink' to={`/${data?.idCountry}/country`} state={data && { idCountry: data?.idCountry, flagCode:data?.flagCode, countryName:data?.countryName}}>
                        <div className="cardCountry">
                            <img src={`/assets/flags/${data?.flagCode?.toLowerCase()}.svg`} alt="" />
                            <h5>{data.countryName}</h5>
                        </div>              
                    </Link>
                    <Link className='dataLink' to={`/recipe/${data?.idMenu}`}>
                        <h3>{data?.menuName}</h3>              
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CardComponent