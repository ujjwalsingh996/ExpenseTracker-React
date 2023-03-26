import React from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Route, Switch } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker";
import UpdateProfile from "./components/UpdateProfile";

function App() {
  return (
  
      <Switch>
      <Route path="/" exact>
        <SignUp/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/exptracker">
        <ExpenseTracker/>
      </Route>
      <Route path="/update">
        <UpdateProfile/>
      </Route>
      </Switch>
      
  );
}

export default App;
