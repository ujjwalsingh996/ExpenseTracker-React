import React, { useContext, useRef } from "react";
import './ExpenseTracker.css'
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

const ExpenseTracker = () => {
    const moneyInputRef = useRef();
    const descInputRef = useRef();
    const categoryInputRef = useRef();
    const authCtx = useContext(AuthContext)
    const history = useHistory();

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
    const logOutHandler = () => {
        authCtx.logout();
        history.replace('/login')
    }

    const expenseHandler = (event) => {
        event.preventDefault();
        const enteredMoney = moneyInputRef.current.value;
        const enteredDesc = descInputRef.current.value;
        const enteredCategory = categoryInputRef.current.value;
        console.log(enteredMoney, enteredDesc, enteredCategory)
        

        moneyInputRef.current.value = '';
        descInputRef.current.value = '';
        categoryInputRef.current.value = ''
    }
    return(<React.Fragment>
        <div className="right"> <button onClick={logOutHandler}>Logout</button></div><h1 className="header">Welcome to ExpenseTracker!</h1>
    <button className="button2" onClick={verifyEmailHandler}>Verify Email Id</button>
    <h3 className="header"><Link to="/update">Your Profile is Incomplete</Link></h3>
    <form className="input" onSubmit={expenseHandler}>
        <label>Money Spent:</label>
        <input type="number" ref={moneyInputRef} required></input>
        <label>Description:</label>
        <input type="text" ref={descInputRef} required></input>
        <label>Category:</label>
        <select ref={categoryInputRef}>
            <option value="food">Food</option>
            <option value="fuel">Fuel</option>
            <option value="salary">Salary</option>
        </select>
        <button type="submit">Add Expense</button>
    </form>
   
    </React.Fragment>)

}

export default ExpenseTracker;