import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    list: [],
    singleMail: null,
    isLoading: false,
    error: null,
    success: null,
};

const mailSlice = createSlice({
    name: "mail",
    initialState,
    reducers: {
        mailRequest: (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        mailSuccess: (state, action) => {
            state.isLoading = false;
            state.success = action.payload?.message || null;
            state.error = null;
            if (state.success) toast.success(state.success);
        },
        mailFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.success = null;
            if (state.error) toast.error(state.error);
        },
        getMailsSuccess: (state, action) => {
            state.isLoading = false;
            state.list = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        },
        getSentMailsSuccess: (state, action) => {
            state.isLoading = false;
            state.list = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        },
        getSingleMailSuccess: (state, action) => {
            state.isLoading = false;
            state.singleMail = action.payload || {};
            state.error = null;
        },
    },
});

export const {
    mailRequest,
    mailSuccess,
    mailFail,
    getMailsSuccess,
    getSentMailsSuccess,
    getSingleMailSuccess,
} = mailSlice.actions;

export const fetchMails = () => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.get(`${baseURL}/mail/get-all-mails`);
        dispatch(getMailsSuccess(data.data || []));
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
};

export const senteMail = (mailData) => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.post(`${baseURL}/mail/sent-email`, mailData);
        dispatch(mailSuccess(data));
        dispatch(fetchMails());
        console.log(data);
        return data;
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
};

export const getAllSentMails = () => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.get(`${baseURL}/mail/get-all-sent-mails`);
        dispatch(getSentMailsSuccess(data.data || []));
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
};

export const getBySingleMail = (id) => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.get(`${baseURL}/mail/get-by-single-mail/${id}`);
        dispatch(getSingleMailSuccess(data.data));
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
}

export const updateMail = (id, mailData) => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.put(`${baseURL}/mails/update-mail/${id}`, mailData);
        dispatch(mailSuccess(data));
        dispatch(fetchMails());
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
};

export const deleteMail = (id) => async (dispatch) => {
    try {
        dispatch(mailRequest());
        const { data } = await axios.delete(`${baseURL}/mails/delete-mail/${id}`);
        dispatch(mailSuccess(data));
        dispatch(fetchMails());
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(mailFail(errMsg));
    }
};

export default mailSlice.reducer;
