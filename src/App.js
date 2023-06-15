import React from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Route, Switch } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker";
import UpdateProfile from "./components/UpdateProfile";
import ForgotPassword from "./components/ForgotPassword";

function App() {

  return (
    <Switch>
      <Route path="/" exact>
        <SignUp />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/exptracker">
        <ExpenseTracker />
      </Route>
      <Route path="/update">
        <UpdateProfile />
      </Route>
      <Route path="/forgot">
        <ForgotPassword />
      </Route>
    </Switch>
  );
}

export default App;
