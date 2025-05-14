import { useEffect, useMemo, useState } from 'preact/hooks'
import React from 'react'
import { googleLogin, testAuth, userSignUp } from '../features/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GoogleLogin, useGoogleLogin  } from '@react-oauth/google';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
library.add(faGoogle, faEye, faEyeSlash)
import axios from 'axios'
import { resetUser } from '../features/userSlice'
const SignupScreen = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || "/"
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [nameOfUser, setNameOfUser] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [warnText, setWarnText] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const{dataUser, login, status, message, error, user} = useSelector(state => state.user)
   function makeid(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 10; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }
  useEffect(() => {
    document.title = "SignUp - Recipe of World"
  }, [])
  
  useEffect(() => {
    if(login){
      setNameOfUser("")
      setUserEmail("")
      setUserName("")
      navigate(from, { replace: true })

    }
    if(status == 201){
      setLoading(false)
      const date = new Date().getTime() + 1 * 3600 * 1000
      let query = makeid() + date + makeid() + makeid() + makeid() + makeid() + makeid()
      navigate('/verify?ky6pwSPmP0xcu=' + query)
    }
    else if(status == 400 || status == 401) {
      setLoading(false)
      setWarnText(message)
      dispatch(resetUser())
    }
  
  }, [login, status])
  
const testhandleGoogles = async (response) => { 
  dispatch(googleLogin(response.credential))
 
}
const handleGoogle = 
useGoogleLogin({
  onSuccess: async response => {
    dispatch(googleLogin(response.access_token))
}
});
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    dispatch(userSignUp({userName, password, userEmail, nameOfUser}))
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
            <h2>SIGNUP</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {warnText &&(
              <div className="inputWrapper">
                <div className="textWarn">
                  <h4>{warnText}</h4>
                </div>
              </div>
            ) }
            
              <input type="text" placeholder='UserName' onChange={(e) => {setUserName(e.target.value); setWarnText("")}} required />
                        
              <input type="text" placeholder='Email' onChange={(e) => {setUserEmail(e.target.value); setWarnText("")}} required />
                        
              <input type="text" placeholder='Name ' onChange={(e) => {setNameOfUser(e.target.value); setWarnText("")}} required />
            <label className='inputWrapper'>
            <input type={ showPassword ? "text" : "password" } name="password" id="password" placeholder='password' pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" onChange={(e) => {setPassword(e.target.value); setWarnText("")}} required />
            <span onClick={(e) =>{ e.preventDefault(); setShowPassword((prev) => !prev)}}>
              <FontAwesomeIcon className="iconUtil"  icon={showPassword ? faEyeSlash : faEye } />
              </span>
            </label>
          
            <button type='submit' disabled={loading}>
            {loading && (<div className='loader'></div>)}
              SignUp
            </button>
          </form>
          <div className="otherButton">
          <button onClick={() => handleGoogle()}>
            <FontAwesomeIcon className="iconUtil"  icon={faGoogle} />Sign up with Google
            </button>
            <div className='registerButton'>
              <p>Have an account?</p><Link to={'/login'} onClick={() => dispatch(resetUser())}>Log in</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default SignupScreen