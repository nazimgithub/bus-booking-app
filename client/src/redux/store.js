import { combineReducers, configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertSlice";
import usersReducer from "./usersSlice";

const rootReducer = combineReducers({
  alerts: alertReducer,
  users: usersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
