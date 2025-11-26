import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/context/authentication/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
