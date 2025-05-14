import { useEffect, useMemo, useState } from 'preact/hooks'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { forgotContent, resetStatus, resetUser } from '../features/userSlice'
import { forgotPwd, resetPwd, resetUpdatePwd } from '../features/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const ResetScreen = () => {
    const[searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loadingButton, setLoadingButton] = useState(false)
    const [warnText, setWarnText] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const {forgotData, status, message, loading} = useSelector(state => state.user)

    const [userPassword, setUserPassword] = useState("")
    function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    useEffect(() => {
        document.title = "Reset Password - Recipe of World"
        if(searchParams.get('cGLIxZ9TK3pBtV') ){
            const unique = searchParams.get('cGLIxZ9TK3pBtV')
            dispatch(resetPwd(unique))
        }
    }, [])
    useEffect(() => {
        if(status === 200 || status === 400) {
            setWarnText(message)
            // setLoadingButton(false)
            resetUser()
        }
    }, [status])


    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(resetUpdatePwd({idUser:forgotData.idUser, userPassword }))
        setLoadingButton(true)
    }
    console.log(loadingButton)
    
    return (
        <div>
            <div className="loginContainer">
                <div className="loginWrapper ">
                <div className="logo" style={{ marginBottom:'1rem' }}>
                <img src="/assets/images/worldRecipe.png" alt="" />
                <h3 className="textHeader">Recipe Of World</h3>                
            </div>
                {loading ?(
                <div className="mainContainerCenter">
                    <div className='loaderPage'></div>
                </div>
            ):(
                warnText ? (
                    <div className="otherButton">
                        <div className='registerButton'>
                            <h2>{warnText}</h2>
                        </div>
                    </div>
                ):(
                    <>
                        <div className="textHeader">
                            <h2>Reset Password</h2>
                        </div>          
                        <form onSubmit={handleSubmit}>
                        <label className='inputWrapper'>
                            <input type={ showPassword ? "text" : "password" } placeholder='New password' pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" onChange={(e) => {setUserPassword(e.target.value); }} />
                            <span onClick={(e) =>{ e.preventDefault(); setShowPassword((prev) => !prev)}}>
                            <FontAwesomeIcon className="iconUtil"  icon={showPassword ? faEyeSlash : faEye } />
                            </span>
                        </label>
                            <button disabled={loadingButton}> 
                                {loadingButton && (<div className='loader'></div>)}          
                                Reset Password
                            </button>
                        </form>                          
                    </>
                )
            )       
        }                     
                    <div className="otherButton">
                        <div className='registerButton'><Link to={'/login'} onClick={() => dispatch(resetUser())} >Back to login</Link>
                        </div>
                    </div>                       
                </div>
            </div>
        </div>
    )
}

export default ResetScreen