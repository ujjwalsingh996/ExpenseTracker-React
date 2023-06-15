import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import "./ExpenseTracker.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { authActions } from "../store/index2";
import { expenseActions } from "../store/index2";
import { themeActions } from "../store/index2";
import {
  sendExpenseData,w
} from "../store/redux-actions";
import axios from "axios";

let sum = 0;
const ExpenseTracker = () => {
  const [button, setButton] = useState(false);
  const expense = useSelector((state) => state.expense.expenses);
  const [expenses, setExpenses] = useState({})
  const emailID = localStorage.getItem("email");
  const moneyInputRef = useRef();
  const descInputRef = useRef();
  const categoryInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const dark = useSelector((state) => state.theme.theme);
  const downloadRef = useRef(null);
  const refresh = useSelector((state) => state.expense.expenses) 
  const [state, setState] = useState(false)

  const money = useSelector((state) => state.expense.money);

  let emailid = "";
  for (let i = 0; i < emailID.length; i++) {
    if (emailID[i] == "@") {
      continue;
    }
    if (emailID[i] == ".") {
      continue;
    }
    emailid = emailid + emailID[i];
  }
  console.log(emailid);

  const verifyEmailHandler = async () => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBbRPGTnJU-_PGp3-QYjr7oO-rAhHYqEp4",
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
    dispatch(authActions.logout());
  };

//   useEffect(() => {
//     dispatch(fetchExpenseData());
    
//   }, []);


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
    setState((prev) => !prev)
    dispatch(sendExpenseData(obj));

    axios
      .put(
        `https://auth-et-default-rtdb.firebaseio.com//expenses${emailid}/${id}.json`,
        obj2
      )
      .then((res) => {
        console.log(res.data);
        console.log("Expense Successfully Updated");
      });

      

    
  };

  useEffect(() => {
    const getData = () => {
      axios
        .get(
          `https://auth-et-default-rtdb.firebaseio.com//expenses${emailid}.json`
        )
        .then((response) => {
          setExpenses(response.data);
          let sum = 0;
          Object.keys(response.data).map(
            (key) => (
                sum = Number(sum) + Number(response.data[key].money),
              (sum = Number(sum) + Number(response.data[key].money)),
              dispatch(expenseActions.addItems(response.data)),
              dispatch(expenseActions.money(response.data[key].money)),
              dispatch(expenseActions.category(response.data[key].category)),
              dispatch(expenseActions.desc(response.data[key].desc))

            )
          );
          console.log(sum)
          if(sum >= 10000 )
          {
            setButton(true)
          }
          else {
            setButton(false)
          console.log(sum);
          }
        });
    };
    getData();

  }, [state]);

  const expenseDeleteHandler = (id) => {
    axios.delete(
      `https://auth-et-default-rtdb.firebaseio.com//expenses${emailid}/${id}.json`
    );
    console.log("expense successfully deleted");
    setState((prev) => !prev)
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

  const handleDownload = () => {
    let data1 = Object.keys(expense).map((key) => expense[key].money);

    let data2 = Object.keys(expense).map((key) => expense[key].desc);

    let data3 = Object.keys(expense).map((key) => expense[key].category);
    let data = [data1, data2, data3];
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    downloadRef.current.setAttribute("href", url);
    downloadRef.current.setAttribute("download", "file1.csv");
    downloadRef.current.click();
  };

  return (
    <div style={{ backgroundColor: dark ? "grey" : "white" }}>
      <div className="right">
        {" "}
        <button onClick={toggleTheme}>Toggle Theme</button>
        {button && <button onClick={activatePremium}>Activate Premium</button>}
        {button && (
          <a
            className="anchor"
            ref={downloadRef}
            href="#"
            download="file1.csv"
          ></a>
        )}
        {button && <button onClick={handleDownload}>Download expenses</button>}
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
          <option value="Food">Food</option>
          <option value="Fuel">Fuel</option>
          <option value="Salary">Salary</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>
      <ul>
        {state &&
          Object.keys(expense).map((key) => (
            <ul className="header" key={key}>
              <h3>
                Rs {expense[key].money} ; Category - {expense[key].category}{" "}
                ;Description - {expense[key].desc}{" "}
                <button
                  onClick={() => {
                    expenseEditHandler(
                      key,
                      expense[key].money,
                      expense[key].category,
                      expense[key].desc
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
      <ul>
      {!state &&
          Object.keys(expense).map((key) => (
            <ul className="header" key={key}>
              <h3>
                Rs {expense[key].money} ; Category - {expense[key].category}{" "}
                ;Description - {expense[key].desc}{" "}
                <button
                  onClick={() => {
                    expenseEditHandler(
                      key,
                      expense[key].money,
                      expense[key].category,
                      expense[key].desc
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
