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
  return (dispatch, getState) => {
    const uid = getState().auth.uid;

    const {
      description = "",
      note = "",
      amount = 0,
      createdAt = 0
    } = expenseData;

    const expense = { description, note, amount, createdAt };

    return database
      .ref(`users/${uid}/expenses`)
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

export const startRemoveExpense = ({ id } = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;

    console.log(id);
    return database
      .ref(`users/${uid}/expenses/${id}`)
      .remove()
      .then(() => {
        console.log("removed successfully");
        dispatch(removeExpense({ id }));
      })
      .catch(error => console.log(error));
  };
};

// 3) EDIT_EXPENSE
export const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates
});

export const startEditExpense = (id, updates) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;

    return database
      .ref(`users/${uid}/expenses/${id}`)
      .update(updates)
      .then(() => {
        console.log(`Expense with id: ${id} edited successfully`);
        dispatch(editExpense(id, updates));
      })
      .catch(error => console.log(error));
  };
};

// SET_EXPENSES
export const setExpenses = expenses => ({
  type: "SET_EXPENSES",
  expenses
});

export const startSetExpenses = () => {
  return (dispatch, getState) => {
    // const state = getState();
    const uid = getState().auth.uid;

    // console.log(`state`);
    // console.log(state);
    // console.log(`users/${uid}/expenses`);
    return database
      .ref(`users/${uid}/expenses`)
      .once("value")
      .then(dataSnapshot => {
        const expenses = [];

        dataSnapshot.forEach(childSnapshot => {
          const key = childSnapshot.key;
          const childSnapshotVal = childSnapshot.val();

          expenses.push({
            ...childSnapshotVal,
            id: key
          });
        });

        // console.log("startSetExpenses EXPENSES");
        // console.log(expenses);

        dispatch(setExpenses(expenses));
      })
      .catch(error => console.log(error));
  };
};
