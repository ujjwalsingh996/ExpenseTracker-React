import React from "react";
import { Link } from "react-router-dom";

const ExpenseTracker = () => {
    return(<React.Fragment><h1>Welcome to ExpenseTracker!</h1>
    <Link to="/update">Your profile is Incomplete</Link></React.Fragment>)
}

export default ExpenseTracker;