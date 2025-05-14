import { useEffect, useMemo, useState } from 'preact/hooks'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { forgotContent, resetStatus, resetUser } from '../features/userSlice'
import { forgotPwd } from '../features/userActions';

const ForgotScreen = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const{status, login} = useSelector(state => state.user)

    const from = location.state?.from?.pathname || "/"
    const [userEmail, setUserEmail] = useState("")
    function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    useEffect(() => {
        document.title = "Forgot Password-Recipe of World"
      }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(forgotPwd(userEmail))
        dispatch(forgotContent())
        navigate('/login', {replace: true})
    }
    return (
        <div>
            <div className="loginContainer">
                <div className="loginWrapper ">
                    <div className="textHeader">
                    <div className="logo" style={{ marginBottom:'1rem' }}>
                <img src="/assets/images/worldRecipe.png" alt="" />
                <h3 className="textHeader">Recipe Of World</h3>                
            </div>
                        <h2>Forgot Password</h2>
                    </div>          
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder='Email Address (yourmail@example.com)' onChange={(e) => {setUserEmail(e.target.value); dispatch(resetUser())}} />
                        <button >          
                            Reset Password
                        </button>
                    </form>
                    <div className="otherButton">
                        <div className='registerButton'><Link to={'/login'} >Back to login</Link>
                        </div>
                    </div>      
                </div>
            </div>
        </div>
    )
}

export default ForgotScreen