import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  currentUserData: null,
  isLoading: false,
  error: null,
  success: null,
  isAuthenticated: false,
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
      const userData =
        action.payload?.user || action.payload?.data?.user || action.payload;
      state.user = userData;
      state.currentUserData = userData;
      state.isAuthenticated = true;
      state.success = action.payload?.message || "Success";
      state.error = null;

      if (action.payload?.showToast) {
        toast.success(state.success);
      }
    },
    authFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      toast.error(action.payload);
    },
    logoutUser: (state) => {
      state.user = null;
      state.currentUserData = null;
      state.isLoading = false;
      state.isAuthenticated = false;
      state.success = null;
      state.error = null;
    },
    clearAuthState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFail,
  logoutUser,
  clearAuthState,
} = authSlice.actions;

// Helper function to handle errors
const handleError = (err) => {
  const errorMessage =
    err.response?.data?.message || err.message || "Something went wrong";
  toast.error(errorMessage);
  return errorMessage;
};

// Async action creators
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/signup`, userData);
    dispatch(authSuccess({ ...data, showToast: true }));
    await dispatch(getCurrentUser()); // Wait for current user to load
    return data;
  } catch (err) {
    dispatch(authFail(handleError(err)));
    throw err;
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/login`, credentials);
    dispatch(authSuccess({ ...data, showToast: true }));
    await dispatch(getCurrentUser()); // Wait for current user to load
    return data;
  } catch (err) {
    dispatch(authFail(handleError(err)));
    throw err;
  }
};

export const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.get(`${baseURL}/auth/get-current-user`);
    dispatch(authSuccess(data)); // Use authSuccess to update all state
    return data;
  } catch (error) {
    // Don't show toast for current user fetch failure
    dispatch(authFail(error.response?.data?.message || "Session expired"));
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(authRequest());
    await axios.get(`${baseURL}/auth/logout`);
    dispatch(logoutUser());
    toast.success("Logged out successfully");
  } catch (error) {
    dispatch(authFail(handleError(error)));
    throw error;
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/forgot-password`, {
      email,
    });
    dispatch(authSuccess({ ...data, showToast: true }));
    return data;
  } catch (err) {
    dispatch(authFail(handleError(err)));
    throw err;
  }
};

export const resetPassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(
      `${baseURL}/auth/reset-password`,
      passwordData
    );
    dispatch(authSuccess({ ...data, showToast: true }));
    return data;
  } catch (err) {
    dispatch(authFail(handleError(err)));
    throw err;
  }
};

export const verifyOTP = (otpData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/verify-otp`, otpData);
    dispatch(authSuccess({ ...data, showToast: true }));
    return data;
  } catch (err) {
    dispatch(authFail(handleError(err)));
    throw err;
  }
};

export default authSlice.reducer;
