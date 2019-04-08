import uuid from "uuid";
import database from "../firebase/firebase";

// Actions
// 1) ADD_EXPENSE
// 2) REMOVE_EXPENSE
// 3) EDIT_EXPENSE
// 4) SET_TEXT_FILTER
// 5) SORT_BY_DATE
// 6) SORT_BY_AMOUNT
// 7) SET_START_DATE
// 8) SET_END_DATE

// 1) ADD_EXPENSE
export const addExpense = expense => ({
  type: "ADD_EXPENSE",
  expense
});

export const startAddExpense = (expenseData = {}) => {
  return dispatch => {
    const {
      description = "",
      note = "",
      amount = 0,
      createdAt = 0
    } = expenseData;

    const expense = { description, note, amount, createdAt };

    return database
      .ref("expenses")
      .push(expense)
      .then(ref => {
        dispatch(
          addExpense({
            ...expense,
            id: ref.key
          })
        );
      })
      .catch(error => console.log(error));
  };
};

// 2) REMOVE_EXPENSE
export const removeExpense = ({ id = "" } = {}) => ({
  type: "REMOVE_EXPENSE",
  id
});

// 3) EDIT_EXPENSE

export const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates
});
