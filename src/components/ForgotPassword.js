import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const emailInputRef = useRef();
  const history = useHistory();
  const email = useSelector((state) => state.auth.emailID)
 
  let content;
  const resetPasswordHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data;
      content = <p>Loading..</p>;
      if (response.ok) {
        content = <p></p>;
        data = await response.json();
        console.log("Password Reset Successful");
        history.replace("/login");
      } else {
        data = await response.json();
        let errorMessage = "Password Reset Failed";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      {content}
      <form className="input">
        <label>Enter the email with which you have registered.</label>
        <input type="email" ref={emailInputRef}></input>
        <button onClick={resetPasswordHandler}>Send Link</button>
      </form>
    </React.Fragment>
  );
};

export default ForgotPassword;
