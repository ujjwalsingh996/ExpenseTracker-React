import React, { useContext, useEffect, useRef, useState } from "react";
import "./ExpenseTracker.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { authActions } from "../store/index2";
import { expenseActions } from "../store/index2";
import { themeActions } from "../store/index2";

const ExpenseTracker = () => {
  const token = useSelector((state) => state.auth.token);
  const [button, setButton] = useState(false);
  const email = useSelector((state) => state.auth.emailID);
  const [expenses, setExpenses] = useState({});
  const [refresh, setRefresh] = useState(true);
  const moneyInputRef = useRef();
  const descInputRef = useRef();
  const categoryInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const dark = useSelector((state) => state.theme.theme);
  const downloadRef = useRef(null);


  let emailid = "";
  for (let i = 0; i < email.length; i++) {
    if (email[i] === "@") {
      continue;
    }
    if (email[i] === ".") {
      continue;
    }
    emailid = emailid + email[i];
  }
  console.log(emailid);

  const verifyEmailHandler = async () => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDCbHcNqtDAJHrL7U_2YgYvyOjHTc60FoA",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
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
    dispatch(authActions.logout());
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
    dispatch(expenseActions.money(enteredMoney));
    dispatch(expenseActions.category(enteredCategory));
    dispatch(expenseActions.desc(enteredDesc));
    moneyInputRef.current.value = "";
    descInputRef.current.value = "";
    categoryInputRef.current.value = "";
    axios
      .post(
        `https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses${emailid}.json`,
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
    axios
      .put(
        `https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses${emailid}/${id}.json`,
        obj2
      )
      .then((res) => {
        console.log(res.data);
        console.log("Expense Successfully Updated");
      });
    setRefresh((prevState) => !prevState);
  };

  useEffect(() => {
    const getData = () => {
      axios
        .get(
          `https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses${emailid}.json`
        )
        .then((response) => {
          setExpenses(response.data);
          let sum = 0;
          Object.keys(response.data).map(
            (key) => (
              (sum = Number(sum) + Number(response.data[key].money)),
              dispatch(expenseActions.money(response.data[key].money)),
              dispatch(expenseActions.category(response.data[key].category)),
              dispatch(expenseActions.desc(response.data[key].desc))
            )
          );
          console.log(sum);
          if (sum >= 10000) {
            setButton(true);
          } else {
            setButton(false);
          }
        });
    };

    getData();
  }, []);

  const expenseDeleteHandler = (id) => {
    axios.delete(
      `https://expense-tracker-1266e-default-rtdb.firebaseio.com/expenses${emailid}/${id}.json`
    );
    console.log("expense successfully deleted");
    setRefresh((prevState) => !prevState);
    dispatch(expenseActions.id(id));
  };

  const expenseEditHandler = (id, money, category, description) => {
    moneyInputRef.current.value = money;
    descInputRef.current.value = description;
    categoryInputRef.current.value = category;

    const objNew = {
      money: moneyInputRef.current.value,
      desc: descInputRef.current.value,
      category: categoryInputRef.current.value,
    };
    expenseDeleteHandler(id, objNew);
  };

  const activatePremium = () => {
    dispatch(themeActions.dark());
  };

  const toggleTheme = () => {
    dispatch(themeActions.toggle());
  };

  let data1 = Object.keys(expenses).map((key) => expenses[key].money);

  let data2 = Object.keys(expenses).map((key) => expenses[key].desc);
  let data = [data1, data2];
  if (button) {
    
    const a1 = document.getElementById("a1");
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob) || window.webkitURL.createObjectURL(blob);
    downloadRef.current.href = url;
  }

  return (
    <div style={{ backgroundColor: dark ? "grey" : "white" }}>
      <div className="right">
        {" "}
        <button onClick={logOutHandler}>Logout</button>
        {button && <button onClick={activatePremium}>Activate Premium</button>}
        {button && (
          <a ref={downloadRef} to="#" download="file1.csv">
            Download Expenses
          </a>
        )}
        <button onClick={toggleTheme}>Toggle Theme</button>
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
          <option value="Food">Food</option>
          <option value="Fuel">Fuel</option>
          <option value="Salary">Salary</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>
      <ul>
        {expenses &&
          Object.keys(expenses).map((key) => (
            <ul className="header" key={key}>
              <h3>
                Rs {expenses[key].money} ; Category - {expenses[key].category}{" "}
                ;Description - {expenses[key].desc}{" "}
                <button
                  onClick={() => {
                    expenseEditHandler(
                      key,
                      expenses[key].money,
                      expenses[key].category,
                      expenses[key].desc
                    );
                  }}
                >
                  Edit
                </button>{" "}
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
    </div>
  );
};

export default ExpenseTracker;
