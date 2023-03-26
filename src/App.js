import React from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Route, Switch } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker";

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
      </Switch>
  );
}

export default App;
