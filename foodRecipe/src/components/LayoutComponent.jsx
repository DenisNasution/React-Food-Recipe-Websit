import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from "react-router-dom";
import { resetStatus, resetUser } from '../features/userSlice';
import { testAuth, userLogout } from '../features/userActions';
import { useEffect } from 'preact/hooks';

function LayoutComponent() {
  const dispatch = useDispatch()
  const {login, user} = useSelector(state => state.user)  
  return (
    <div className='wholeWrapper'>    
    <div className='headerContainer'>
        <div className='header' >
          <Link to="/" className='linkLogo'>
            <div className="logo">
                <img src="/assets/images/worldRecipe.png" alt="" />
                <h4>Recipe Of World</h4>                
            </div>
          </Link>
            <div className="headerMenu">
              <ul>
                <li><Link to="/countryList">Country</Link></li>
                <li><Link to="/mealsCategory">Meals</Link></li>
                <li><Link to="/addRecipe">Submit Recipe</Link></li>
                {login && user ? (<li><Link to="/" onClick={() => dispatch(userLogout())}>Logout</Link></li>) : (<li><Link to="/login" >Login</Link></li>)}
                {login && user ? (<li><Link to={`/${user.idUser}/user`} >Profile</Link></li>) : ""}
                
              </ul>
            </div>
        </div>
        
    </div>
    <Outlet />
    <div className="footer">
            <div className="logo">
                <img src="/assets/images/worldRecipe.png" alt="" />
                <h4>Recipe Of World</h4>                
            </div>
            {/* <div className="footerMenu">
              <ul>
                <li><a href="">Contact Us</a></li>
                <li><a href="">Privacy Policy</a></li>                
              </ul>
            </div> */}
            <div className="citation">
              <p>Powered By kavinesia.my.id</p>
            </div>
      </div>   
    </div>
  )
}

export default LayoutComponent