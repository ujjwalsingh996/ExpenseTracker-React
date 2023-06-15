import React, { useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../store/auth-context";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/index2";

const Login = () => {

  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.emailID);

  const autCtx = useContext(AuthContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  const signupHandler = () => {
    history.replace("/");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    autCtx.setEmail(enteredEmail)
    const enteredPassword = passwordRef.current.value;
    console.log(email, enteredPassword);
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBbRPGTnJU-_PGp3-QYjr7oO-rAhHYqEp4",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data;
      if (response.ok) {
        data = await response.json();
        console.log("User has successfully Logged In");
      } else {
        data = await response.json();
        console.log(data)
        let errorMessage = "Login Failed";
        throw new Error(errorMessage);
        
      }
      autCtx.login(data.idToken);
      autCtx.setEmail(enteredEmail)
      
      dispatch(authActions.token(data.idToken))
      dispatch(authActions.login())
      dispatch(authActions.emailId(enteredEmail))
      history.replace("/exptracker");
    } catch (err) {
      console.log(err);
    }
    dispatch(authActions.login())
    dispatch(authActions.emailId(enteredEmail))
    
  };
  return (
    <React.Fragment>
      <h1 className="header">Login</h1>
      <form className="input" onSubmit={submitHandler}>
        <label>Email:</label>
        <input type="email" ref={emailRef}></input>
        <label>Password:</label>
        <input type="password" ref={passwordRef}></input>
        <h4 className="header"><Link to="/forgot">Forgot Password?</Link></h4>
        <button type="submit">Login</button>
      </form>
      <button className="button2" onClick={signupHandler}>
        Don't have an account?Sign Up!
      </button>
    </React.Fragment>
  );
};

export default Login;
