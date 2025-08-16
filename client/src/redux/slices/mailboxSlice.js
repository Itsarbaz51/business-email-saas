// src/redux/mailboxSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  list: [],
  isLoading: false,
  error: null,
  success: null,
};

const mailboxSlice = createSlice({
  name: "mailbox",
  initialState,
  reducers: {
    mailboxRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    getMailboxesSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload.data || [];
      state.error = null;
    },

    addMailboxSuccess: (state, action) => {
      state.isLoading = false;
      state.list.push(action.payload);
      state.success = "Mailbox added successfully";
      toast.success(state.success);
    },
    updateMailboxSuccess: (state, action) => {
      state.isLoading = false;
      state.list = state.list.map((m) =>
        m.id === action.payload.id ? action.payload : m
      );
      state.success = "Mailbox updated successfully";
      toast.success(state.success);
    },
    deleteMailboxSuccess: (state, action) => {
      state.isLoading = false;
      state.list = state.list.filter((m) => m.id !== action.payload);
      state.success = "Mailbox deleted successfully";
      toast.success(state.success);
    },
    mailboxFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
  },
});

export const {
  mailboxRequest,
  addMailboxSuccess,
  getMailboxesSuccess,
  updateMailboxSuccess,
  deleteMailboxSuccess,
  mailboxFail,
} = mailboxSlice.actions;

// ✅ Fetch all mailboxes
export const fetchMailboxes = () => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.get(`${baseURL}/mailboxes/get-mailbox`);
    console.log(data);

    dispatch(getMailboxesSuccess(data));
  } catch (err) {
    dispatch(
      mailboxFail(err?.response?.data?.message || "Failed to fetch mailboxes")
    );
  }
};

// ✅ Add mailbox
export const createMailbox = (mailboxData) => async (dispatch) => {
  console.log(mailboxData);

  try {
    dispatch(mailboxRequest());
    const { data } = await axios.post(
      `${baseURL}/mailboxes/create-mailbox`,
      mailboxData
    );
    dispatch(addMailboxSuccess(data));
    dispatch(fetchMailboxes());
  } catch (err) {
    dispatch(
      mailboxFail(err?.response?.data?.message || "Failed to add mailbox")
    );
  }
};

// ✅ Update mailbox
export const updateMailbox = (id, mailboxData) => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.put(
      `${baseURL}/mailboxes/update-mailbox/${id}`,
      mailboxData
    );
    dispatch(updateMailboxSuccess(data));
    dispatch(fetchMailboxes());
  } catch (err) {
    dispatch(
      mailboxFail(err?.response?.data?.message || "Failed to update mailbox")
    );
  }
};

// ✅ Delete mailbox
export const deleteMailbox = (id) => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    await axios.delete(`${baseURL}/mailboxes/delete-mailbox/${id}`);
    dispatch(deleteMailboxSuccess(id));
    dispatch(fetchMailboxes());
  } catch (err) {
    dispatch(
      mailboxFail(err?.response?.data?.message || "Failed to delete mailbox")
    );
  }
};

export default mailboxSlice.reducer;
