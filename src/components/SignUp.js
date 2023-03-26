import React, {useRef} from "react";
import { useHistory } from "react-router-dom";
import './SignUp.css'

const SignUp = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmInputRef = useRef(); 
    const history = useHistory();
    

    const submitHandler = async(event) =>{
        event.preventDefault();

        let enteredEmail = emailInputRef.current.value;
    let enteredPassword = passwordInputRef.current.value;
    let confirmPassword = confirmInputRef.current.value;
        try{
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA', {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                let data = await response.json()
                console.log('User has successfully signed up');
            }
            else {
                let data = await response.json();
                let errorMessage = 'Authentication Failed'
                throw new Error(errorMessage)
            }
            history.replace("/login")
         } catch (err) {
            console.log(err)
         }

    }
    const loginHandler = () => {
        history.replace("/login")
    }
    return (
       <React.Fragment>
        <h1 className="header">Sign Up</h1>
        <form className="input" onSubmit={submitHandler}>
            <label>Enter Email:</label>
            <input type="email" ref={emailInputRef} required></input><br/>
            <label>Enter Password:</label>
            <input type="password" ref={passwordInputRef} required></input><br/>
            <label>Confirm Password:</label>
            <input type="password" ref={confirmInputRef} required></input><br/>
            <button type="submit">Sign Up</button>
        </form>
        <button className="button2" onClick={loginHandler}>Have an Account? Login!</button>
       </React.Fragment>
    )
}

export default SignUp;