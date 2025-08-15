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
      const { user, message, showToast } = action.payload || {};

      if (user) {
        state.user = user;
      }

      state.success = message || "Success";
      state.error = null;

      if (showToast) {
        toast.success(state.success);
      }
    },
    authFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.success = null;
      state.error = null;
      toast.success("Logged Out Successfully.");
    },
    authGetCurrentUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user || null;
      state.error = null;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFail,
  logout,
  authGetCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;

const handleError = (err) =>
  err.response?.data?.message || err.message || "Something went wrong.";

// Register
export const register = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/signup`, userData);
    dispatch(authSuccess({ ...data, showToast: true }));
  } catch (err) {
    dispatch(authFail(handleError(err)));
  }
};

// Login
export const login = (credentials) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/login`, credentials);
    dispatch(authSuccess({ ...data, showToast: true }));
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
  } catch (error) {
    dispatch(authFail(handleError(error)));
  }
};

// Update admin
export const updateAdmin = (updateData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(
      `${baseURL}/auth/update-admin`,
      updateData
    );
    dispatch(
      authSuccess({
        user: data.data.user,
        message: "User updated successfully.",
        showToast: true,
      })
    );
  } catch (error) {
    dispatch(authFail(handleError(error)));
  }
};

// Logout
export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};

// Forgot password
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
      await axios.post(`${baseURL}/auth${endpoint}`, body);
      dispatch(
        authSuccess({
          message: "Password recovery step completed.",
          showToast: true,
        })
      );
    } catch (err) {
      dispatch(authFail(handleError(err)));
    }
  };

// Reset password
export const resetPassword = (passwordFormData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    await axios.post(`${baseURL}/auth/reset-password`, passwordFormData);
    dispatch(
      authSuccess({
        message: "Password reset successfully.",
        showToast: true,
      })
    );
  } catch (err) {
    dispatch(authFail(handleError(err)));
  }
};
