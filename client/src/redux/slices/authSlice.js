import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.success = action.payload.message;
    },
    authLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.success = action.payload.message;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
  },
});

export const { authRequest, authSuccess, authLoginSuccess, authFailure } =
  authSlice.actions;
export default authSlice.reducer;

const baseURL = import.meta.env.VITE_BASE_URL;

// ================== Registration Action ==================
export const register = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/signup`, userData);
    dispatch(authSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const { data } = error.response;
    dispatch(authFailure(data.message) || "API Connection Error");
    toast.error(data.message);
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/login`, userData);
    dispatch(authLoginSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const { data } = error.response;
    dispatch(authFailure(data.message) || "API Connection Error");
    toast.error(data.message);
  }
};
