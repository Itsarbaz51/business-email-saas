import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const initialUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: initialUser,
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
        localStorage.setItem("user", JSON.stringify(user));
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
      localStorage.removeItem("user");
      toast.success("Logged Out Successfully.");
    },
  },
});

export const { authRequest, authSuccess, authFail, logout } = authSlice.actions;
export default authSlice.reducer;

const handleError = (err) =>
  err.response?.data?.message || err.message || "Something went wrong.";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const login = (credentials) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await axios.post(`${baseURL}/auth/login`, credentials);
    console.log(data);
    
    dispatch(authSuccess(data));
  } catch (err) {
    dispatch(authFail(handleError(err)));
  }
};

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

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};

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
