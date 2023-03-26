import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  const signupHandler = () => {
    history.replace("/");
  };

  const submitHandler = async (event) => {
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    console.log(enteredEmail, enteredPassword);
    event.preventDefault();
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA",
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
      if (response.ok) {
        let data = await response.json();
        console.log("User has successfully Logged In");
      } else {
        let data = await response.json();
        let errorMessage = "Login Failed";
        throw new Error(errorMessage);
      }
      history.replace("/exptracker");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <h1 className="header">Login</h1>
      <form className="input" onSubmit={submitHandler}>
        <label>Email:</label>
        <input type="email" ref={emailRef}></input>
        <label>Password:</label>
        <input type="password" ref={passwordRef}></input>
        <button type="submit">Login</button>
      </form>
      <button className="button2" onClick={signupHandler}>
        Don't have an account?Sign Up!
      </button>
    </React.Fragment>
  );
};

export default Login;
