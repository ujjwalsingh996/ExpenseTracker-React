import React from "react";
import AuthContext from "./auth-context";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const AuthContextProvider = (props) => {
    const history = useHistory();
    const initialToken = localStorage.getItem('token')
    const [token, setToken] = useState(initialToken)
    const [email, setEmail] = useState('')
    const userIsLoggedIn = !!token;
 
    const loginHandler = (token) => {
        setToken(token)
        localStorage.setItem('token', token)
    }

    const logoutHandler = () => {
        setToken(null)
        localStorage.removeItem('token')
        console.log('logout successful')
       
    }

    const emailHandler = (email) => {
        setEmail(email)
        localStorage.setItem('email', email)
    }
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        email: email,
        login: loginHandler,
        logout: logoutHandler,
        setEmail: emailHandler,
    }
    return (
        <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
    )
}

export default AuthContextProvider;