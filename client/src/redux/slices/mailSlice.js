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
    mailDeleteSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload || {};
      state.error = null;
    },
    mailTrashSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload || {};
      state.error = null;
    },
    mailGetTrashSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    receivedAllMail: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
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
  mailDeleteSuccess,
  mailTrashSuccess,
  mailGetTrashSuccess,
  receivedAllMail,
} = mailSlice.actions;

export const getAllMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-all-mails`);
    console.log(data);

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
    dispatch(getAllMails());
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
    const { data } = await axios.get(
      `${baseURL}/mail/get-by-single-mail/${id}`
    );
    dispatch(getSingleMailSuccess(data.data));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const updateMail = (id, mailData) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.put(
      `${baseURL}/mails/update-mail/${id}`,
      mailData
    );
    dispatch(mailSuccess(data));
    dispatch(getAllMails());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const deleteMails = (idsOrId) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const payload = Array.isArray(idsOrId)
      ? { mailsId: idsOrId }
      : { mailId: idsOrId };
    const { data } = await axios.post(`${baseURL}/mail/delete`, payload);
    dispatch(mailDeleteSuccess(data));
    dispatch(getAllMails());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const moveToTrash = (idsOrId) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const payload = Array.isArray(idsOrId)
      ? { mailsId: idsOrId }
      : { mailId: idsOrId };

    const { data } = await axios.post(`${baseURL}/mail/move-to-trash`, payload);

    dispatch(mailTrashSuccess(data));
    dispatch(getAllMails());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getTrash = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-trash`);
    dispatch(mailGetTrashSuccess(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

// received mail
export const getAllReceivedMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/recived-email`);
    dispatch(receivedAllMail(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export default mailSlice.reducer;
