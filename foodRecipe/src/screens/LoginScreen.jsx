import { useEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import {
  googleLogin,
  testAuth,
  testLogin,
  userLogin,
} from "../features/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
library.add(faGoogle, faEye, faEyeSlash);
import axios from "axios";
import { resetStatus, resetUser } from "../features/userSlice";
import { resetStatus as resetStatusRecipe } from "../features/recipeSlice";
const LoginScreen = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [pwd, setPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warnText, setWarnText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { dataUser, login, user, status, message, forgot } = useSelector(
    (state) => state.user
  );
  const { error } = useSelector((state) => state.recipe);
  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  useEffect(() => {
    document.title = "Login-Recipe of World";
  }, []);

  useEffect(() => {
    if (status == 200 || login) {
      setLoading(false);
      navigate(from, { replace: true });
    } else if (status == 422) {
      setLoading(false);
      const date = new Date().getTime() + 1 * 3600 * 1000;
      let query =
        makeid() + date + makeid() + makeid() + makeid() + makeid() + makeid();
      navigate("/verify?ky6pwSPmP0xcu=" + query);
    } else if (status == 401 || status == 403) {
      setLoading(false);
      setWarnText(message);
      dispatch(resetUser());
    }
    if (forgot) {
      setWarnText(
        "You should receive an email shortly with further instructions. Don't see it? Be sure to check your spam and junk folders"
      );
      dispatch(resetUser());
    }
    if (error) {
      setWarnText("Session expired, please login again");
      dispatch(resetStatusRecipe());
    }
  }, [login, status, forgot, error]);

  const handleGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      dispatch(googleLogin(response.access_token));
    },
  });

  const testhandleGoogles = async (response) => {
    dispatch(testLogin());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(userLogin({ userName, password }));
  };
  console.log(userName, password);
  return (
    <div>
      <div className='loginContainer'>
        <div className='loginWrapper '>
          <div className='textHeader'>
            <div className='logo' style={{ marginBottom: "1rem" }}>
              <img src='/assets/images/worldRecipe.png' alt='' />
              <h3 className='textHeader'>Recipe Of World</h3>
            </div>

            <h2>LOGIN</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {warnText && (
              <div className='inputWrapper'>
                <div className='textWarn'>
                  <h4>{warnText}</h4>
                </div>
              </div>
            )}
            <input
              type='text'
              placeholder='User Name'
              onChange={(e) => {
                setUserName(e.target.value);
                setWarnText("");
              }}
              required
            />
            <label className='inputWrapper'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                id='password'
                placeholder='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                  setWarnText("");
                }}
                required
              />
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((prev) => !prev);
                }}
              >
                <FontAwesomeIcon
                  className='iconUtil'
                  icon={showPassword ? faEyeSlash : faEye}
                />
              </span>
            </label>
            <button type='submit' disabled={loading}>
              {loading && <div className='loader'></div>}
              Login
            </button>
          </form>
          <div className='otherButton'>
            <button onClick={() => handleGoogle()}>
              <FontAwesomeIcon className='iconUtil' icon={faGoogle} />
              Sign in with Google
            </button>
            <div className='registerButton'>
              <p>Don't have an account?</p>
              <Link to={"/signup"}>Join now</Link>
            </div>
            <div className='registerButton'>
              <p></p>
              <Link to={"/forgot"}>Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
