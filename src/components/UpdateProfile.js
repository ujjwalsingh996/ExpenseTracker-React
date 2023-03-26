import React, { useRef, useContext } from "react";
import AuthContext from "../store/auth-context";
import './UpdateProfile.css'

const UpdateProfile = () => {
  const authCtx = useContext(AuthContext);
  const nameInputRef = useRef();
  const profilePhotoInputRef = useRef();
  

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredLink = profilePhotoInputRef.current.value;
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            displayName: enteredName,
            photoUrl: enteredLink,
            deleteAttribute: "DISPLAY_NAME",
            returnSecureToken: true,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      let data;
      if (response.ok) {
        data = response.json();
        console.log("Profile Updated");
      } else {
        data = response.json();
        let errorMessage = "Not Updated";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <h1 className="header">Contact Details</h1>
      <form className="input" onSubmit={submitHandler}>
        <label>Full Name:</label>
        <input type="text" ref={nameInputRef}></input>
        <label>Profile Photo URL</label>
        <input type="text" ref={profilePhotoInputRef}></input>
        <button type="submit">Update</button>
      </form>
    </React.Fragment>
  );
};

export default UpdateProfile;
