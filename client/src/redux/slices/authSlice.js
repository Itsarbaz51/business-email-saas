import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Navigate } from "react-router-dom";
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

// Set base URL and default axios config
const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// ================== Registration Action ==================
export const register = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axiosInstance.post("/auth/signup", userData);
    dispatch(authSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const message =
      error?.response?.data?.message || "API register Connection Error";
    dispatch(authFailure(message));
    toast.error(message);
  }
};

// ================== Login ==================
export const login = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);
    dispatch(authLoginSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const message =
      error?.response?.data?.message || "API login Connection Error";
    dispatch(authFailure(message));
    toast.error(message);
  }
};

// ================== Get Current User ==================
export const getCurrentUser = () => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axiosInstance.get("/auth/get-current-user");
    dispatch(authSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const message =
      error?.response?.data?.message || "API getCurrentUser Connection Error";
    dispatch(authFailure(message));
    toast.error(message);
  }
};

// ================== Logout ==================
export const logout = () => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axiosInstance.get("/auth/logout");
    dispatch(authSuccess(data));
    toast.success(data.message);
  } catch (error) {
    const message = error?.response?.data?.message || "API Connection Error";
    dispatch(authFailure(message));
    toast.error(message);
  }
};
