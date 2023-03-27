import React, { useContext, useEffect, useRef, useState } from "react";
import "./ExpenseTracker.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";
import axios from "axios";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const moneyInputRef = useRef();
  const descInputRef = useRef();
  const categoryInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const verifyEmailHandler = async () => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: authCtx.token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data;
      if (response.ok) {
        data = await response.json();
        console.log("Email ID verified");
      } else {
        data = await response.json();
        let errorMessage = "Verification Failed";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const logOutHandler = () => {
    authCtx.logout();
    history.replace("/login");
  };

  const expenseHandler = async (event, id, obj2) => {
    event.preventDefault();
    const enteredMoney = moneyInputRef.current.value;
    const enteredDesc = descInputRef.current.value;
    const enteredCategory = categoryInputRef.current.value;
    console.log(enteredMoney, enteredDesc, enteredCategory);
    const obj = {
      money: enteredMoney,
      desc: enteredDesc,
      category: enteredCategory,
    };

    moneyInputRef.current.value = "";
    descInputRef.current.value = "";
    categoryInputRef.current.value = "";
    axios
      .post(
        "https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses.json",
        obj
      )
      .then((res) => console.log(res.data));

    // axios
    //   .get(
    //     "https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses.json"
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //     setExpenses(response.data);
    //     console.log(expenses);
    //   });
    getData();
    axios.put(`https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses/${id}.json`, obj2).then((res) => {
        console.log(res.data)
        console.log('Successfully Updated')
    })
  };
  const getData = () => {
    axios
      .get(
        "https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses.json"
      )
      .then((response) => {
        console.log(response.data);
        setExpenses(response.data);
        console.log(expenses);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const expenseDeleteHandler = (id) => {
    axios.delete(
      `https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses/${id}.json`
    );
    getData();
    console.log("expense successfully deleted")
  };

  const expenseEditHandler = (id, money, category,description) => {
    moneyInputRef.current.value = money;
    descInputRef.current.value = description;
    categoryInputRef.current.value = category;

    const objNew = {
        money: moneyInputRef.current.value,
        desc: descInputRef.current.value,
        category: categoryInputRef.current.value
    } 
    expenseDeleteHandler(id, objNew)
    
  }
  return (
    <React.Fragment>
      <div className="right">
        {" "}
        <button onClick={logOutHandler}>Logout</button>
      </div>
      <h1 className="header">Welcome to ExpenseTracker!</h1>
      <button className="button2" onClick={verifyEmailHandler}>
        Verify Email Id
      </button>
      <h3 className="header">
        <Link to="/update">Your Profile is Incomplete</Link>
      </h3>
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
      <ul>
        {Object.keys(expenses).map((key) => (
          <ul className="header" key={key}>
            <h3>
              Rs {expenses[key].money} ; Category - {expenses[key].category}{" "}
              ;Description - {expenses[key].desc} <button onClick={() => {expenseEditHandler(key, expenses[key].money,expenses[key].category, expenses[key].desc )}}>Edit</button>{" "}
              <button
                onClick={() => {
                  expenseDeleteHandler(key);
                }}
              >
                Delete
              </button>
            </h3>
          </ul>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default ExpenseTracker;
