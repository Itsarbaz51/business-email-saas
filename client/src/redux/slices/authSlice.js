import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_BASE_URL;

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
      state.user = action.payload.user || null;
      state.success = action.payload.message || "Success";
      state.error = null;

      if (action.payload?.showToast) {
        toast.success(state.success);
      }
    },
    authFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.success = null;
      state.error = null;
    },
    authGetCurrentUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFail,
  logoutUser,
  authGetCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;

// Helper function to handle errors
const handleError = (err) =>
  err.response?.data?.message || err.message || "Something went wrong.";

// Login
export const login = (credentials) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/login`, credentials);
    dispatch(authSuccess({ ...data, showToast: true }));
    dispatch(getCurrentUser());
  } catch (err) {
    dispatch(authFail(handleError(err)));
  }
};

// Get current user
export const getCurrentUser = () => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.get(`${baseURL}/auth/get-current-user`);
    dispatch(authGetCurrentUser(data));
    return data;
  } catch (error) {
    dispatch(authFail(handleError(error)));
  }
};

// Logout
export const logout = () => async (dispatch) => {
  dispatch(authRequest());
  try {
    await axios.get(`${baseURL}/auth/logout`);
    dispatch(logoutUser());
    toast.success("Logged out successfully");
  } catch (error) {
    dispatch(authFail(handleError(error)));
  }
};

// Forgot Password
export const forgotPassword =
  (email, otp = null, newPassword = null) =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const body = { email };
      let endpoint = "/forgot-password";
      if (otp && newPassword) {
        body.otp = otp;
        body.newPassword = newPassword;
      }
      const { data } = await axios.post(`${baseURL}/auth${endpoint}`, body);
      dispatch(authSuccess({ ...data, showToast: true }));
    } catch (err) {
      dispatch(authFail(handleError(err)));
    }
  };

// Reset Password
export const resetPassword = (passwordFormData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(
      `${baseURL}/auth/reset-password`,
      passwordFormData
    );
    dispatch(authSuccess({ ...data, showToast: true }));
  } catch (err) {
    dispatch(authFail(handleError(err)));
  }
};
