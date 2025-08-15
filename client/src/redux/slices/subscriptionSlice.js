import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    plan: null,
    isLoading: false,
    error: null,
    success: null,
    issubscriptionAuthenticated: false,
};

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        subscriptionRequest: (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        subscriptionSuccess: (state, action) => {
            state.isLoading = false;
            state.plan = action.payload?.data || action.payload; // store subscription data
            state.issubscriptionAuthenticated = true;
            state.success = action.payload?.message || "Subscription successful";
            state.error = null;
            toast.success(state.success);
        },
        subscriptionFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.issubscriptionAuthenticated = false;
            toast.error(action.payload);
        },
    },
});

export const { subscriptionRequest, subscriptionSuccess, subscriptionFail } =
    subscriptionSlice.actions;

// Create or renew subscription (free or paid)
export const createOrRenewSubscription = (userData) => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.post(
            `${baseURL}/subscription/create-renew-subcription`,
            userData
        );
        console.log(data);
        dispatch(subscriptionSuccess(data));
        return data;
    } catch (err) {
        dispatch(
            subscriptionFail(err?.response?.data?.message || "Subscription failed")
        );
        throw err;
    }
};

export default subscriptionSlice.reducer;
