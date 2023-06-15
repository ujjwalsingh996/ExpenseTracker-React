import { expenseActions } from "./index2";

import axios from "axios";



let emailID = localStorage.getItem("email");
let emailid;
if (emailID)
{
  emailid = emailID.replace(/[@.]/g, "")
}

export const sendExpenseData = (obj) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await axios.post(
        `https://auth-et-default-rtdb.firebaseio.com//expenses${emailid}.json`,
        obj
      );
    };
    try {
      await sendRequest();
      console.log("Expenses Updated");
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchExpenseData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://auth-et-default-rtdb.firebaseio.com//expenses${emailid}.json`
      );

      return response;
    };

    try {
      const expenseData = await fetchData();
      console.log(expenseData.data);
      Object.keys(expenseData.data).map((key) =>
        dispatch(expenseActions.addItems(expenseData.data))
      );
      Object.keys(expenseData.data).map((key) =>
        dispatch(expenseActions.money(expenseData.data[key].money))
      );
      Object.keys(expenseData.data).map((key) =>
        dispatch(expenseActions.category(expenseData.data[key].category))
      );
      Object.keys(expenseData.data).map((key) =>
        dispatch(expenseActions.desc(expenseData.data[key].desc))
      );
    } catch (err) {
      console.log(err);
    }
  };
};
