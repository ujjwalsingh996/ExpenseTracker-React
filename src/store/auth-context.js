import React from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: true,
    login: (token) => {},
    logout:  () => {},
    setEmail: (email) => {}
})

export default AuthContext;