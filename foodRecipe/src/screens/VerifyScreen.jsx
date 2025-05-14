import { useState, useEffect } from 'preact/hooks'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetStatus, resetUser } from '../features/userSlice'
import { userVerify } from '../features/userActions'

const VerifyScreen = () => {
    const[searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [session, setSession] = useState(false)
    const [error, setError] = useState(false)
    const [textWarn, setTextWarn] = useState("")
    const{status, message, loading} = useSelector(state => state.user)
    useEffect(() => {
      document.title = "Verify Account - Recipe of World"
      // if (!message) {
      //   navigate("/login", { replace: true })
      // }
     
      if (searchParams.get('ky6pwSPmP0xcu')) {
        const time = searchParams.get('ky6pwSPmP0xcu').slice(10, 23)
        if (new Date().getTime() > time || searchParams.get('ky6pwSPmP0xcu').length < 73 ) {
          setTextWarn("Your Session has been expired")
        }else{
          setTextWarn("An error occurred, please login again through your application.")
        }
      }else if(searchParams.get('xNaLHVXNAWbfi')){
        const unique = searchParams.get('xNaLHVXNAWbfi')
        dispatch(userVerify(unique))
      }else{
        setTextWarn("An error occurred, please login again through your application.")
      }
        // setTimeout(() => {
        //   dispatch(resetStatus())
        // }, "1000");
    
    }, [])
    useEffect(() => {
      if(status === 200 ||status === 201 || status === 400 || status === 422){
        setTextWarn(message)
        dispatch(resetUser())
      }
    }, [status])
    
    console.log(textWarn)
  
  return (
    <div className='loginContainer mainWrapper'>
      <div className='mainContainer'>
        <div className="verifyText">
        <div className="logo" style={{ marginBottom:'1rem' }}>
                <img src="/assets/images/worldRecipe.png" alt="" />
                <h3 className="textHeader">Recipe Of World</h3>                
            </div>
        {loading ?(
              <div className="mainContainerCenter">
                <div className='loaderPage'></div>
              </div>
            ):(

                <div className='registerButton'>
                  <h2>{textWarn}</h2>
                </div>
            )       
        } 
        </div>
      </div>
    </div>
  )
}

export default VerifyScreen