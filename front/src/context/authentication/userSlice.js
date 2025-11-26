import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../utils/getCookie";

// CONNECT THIS INITAL STATE WITH COOKIES AND NOT WITH LOCAL STORAGE TO AVOID PROBLEMS

const initialState = {
  isAuthenticated:
    getCookie("_auth") !== undefined && getCookie("_auth") !== null, // Set initial state from local storage,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem("isLogged", "true");
      state.user = action.payload;
    },
    signupSuccess: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem("isLogged", "true");
      state.user = action.payload;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isLogged");
      state.user = null;
    },
  },
});

export const { loginSuccess, signupSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
