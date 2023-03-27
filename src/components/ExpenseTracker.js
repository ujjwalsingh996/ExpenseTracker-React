import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

const ExpenseTracker = () => {
    const authCtx = useContext(AuthContext)

    const verifyEmailHandler = async() => {
        try{
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA', {
            method: 'POST',
            body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                idToken: authCtx.token,
            }),
            headers: {
                "Content-Type": "application/json",
              },    

        })
        let data;
        if(response.ok)
        {
            data = await response.json()
            console.log('Email ID verified')
        } else {
            data = await response.json();
            let errorMessage = 'Verification Failed'
            throw new Error(errorMessage)
        }
    } catch (err) {
        console.log(err)
    }
    }   
    return(<React.Fragment><h1 className="header">Welcome to ExpenseTracker!</h1>
    <button className="button2" onClick={verifyEmailHandler}>Verify Email Id</button>
    <Link to="/update">Your profile is Incomplete</Link></React.Fragment>)
}

export default ExpenseTracker;