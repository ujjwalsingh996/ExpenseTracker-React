import React, { useRef, useContext } from "react";
import AuthContext from "../store/auth-context";
import { useSelector } from "react-redux";

import "./UpdateProfile.css";

const UpdateProfile = () => {
  const token = useSelector((state) => state.auth.token )
  console.log(token)
  const authCtx = useContext(AuthContext);
  const nameInputRef = useRef();
  const profilePhotoInputRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredLink = profilePhotoInputRef.current.value;
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBbRPGTnJU-_PGp3-QYjr7oO-rAhHYqEp4",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            displayName: enteredName,
            photoUrl: enteredLink,
            deleteAttribute: "PHOTO_URL",
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
        console.log("Profile Updated");
        nameInputRef.current.value = '';
        profilePhotoInputRef.current.value = ''
      } else {
        data = await response.json();
        let errorMessage = "Not Updated";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };



  const editUserDetailsHandler = () => {
    
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBbRPGTnJU-_PGp3-QYjr7oO-rAhHYqEp4",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Update Failed";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data.users[0].displayName)
        nameInputRef.current.value = data.users[0].displayName
      })
      .catch((err) => {
        console.log(err);
      });
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
      <button className="button2" onClick={editUserDetailsHandler}>Edit Details</button>
    </React.Fragment>
  );
};

export default UpdateProfile;
