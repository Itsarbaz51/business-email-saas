// src/redux/domainSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    domains: [],
    isLoading: false,
    error: null,
    success: null,
};

const domainSlice = createSlice({
    name: "domain",
    initialState,
    reducers: {
        domainRequest: (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        getDomainsSuccess: (state, action) => {
            state.isLoading = false;
            state.domains = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        },
        addDomainSuccess: (state, action) => {
            state.isLoading = false;
            if (Array.isArray(state.domains)) {
                state.domains.push(action.payload);
            }
            state.success = "Domain added successfully";
            toast.success(state.success);
        },
        verifyDomainSuccess: (state, action) => {
            state.isLoading = false;
            state.domains = state.domains.map((d) =>
                d.id === action.payload.id ? action.payload : d
            );
            state.success = "Domain verified successfully";
            toast.success(state.success);
        },
        updateDomainSuccess: (state, action) => {
            state.isLoading = false;
            state.domains = state.domains.map((d) =>
                d.id === action.payload.id ? action.payload : d
            );
            state.success = "Domain updated successfully";
            toast.success(state.success);
        },
        deleteDomainSuccess: (state, action) => {
            state.isLoading = false;
            state.domains = state.domains.filter((d) => d.id !== action.payload);
            state.success = "Domain deleted successfully";
            toast.success(state.success);
        },
        domainFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        },
    },
});

export const {
    domainRequest,
    addDomainSuccess,
    getDomainsSuccess,
    updateDomainSuccess,
    deleteDomainSuccess,
    domainFail,
} = domainSlice.actions;

// ✅ Fetch domains with DNS records
export const fetchDomains = () => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.get(`${baseURL}/domain/get-domains`);
        // If API sends object { domains: [...] }, extract i
        console.log("data", data);

        dispatch(getDomainsSuccess(data.data));
    } catch (err) {
        dispatch(domainFail(err?.response?.data?.message || "Failed to fetch domains"));
    }
};

// ✅ Add domain and then refresh list
export const addDomain = (domainName) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.post(`${baseURL}/domain/add-domain`, domainName);
        dispatch(addDomainSuccess(data));
        dispatch(fetchDomains()); // refresh
    } catch (err) {
        dispatch(domainFail(err?.response?.data?.message || "Failed to add domain"));
    }
};

// ✅ Fixed verifyDomain action
export const verifyDomain = (domainName) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.get(`${baseURL}/domain/verify-domain/${domainName}`);
        dispatch(verifyDomainSuccess(data.data)); // Pass updated domain object
        dispatch(fetchDomains()); // Optional: refresh list
    } catch (err) {
        dispatch(domainFail(err?.response?.data?.message || "Failed to verify domain"));
    }
};


// ✅ Update domain
export const updateDomain = (id, domainData) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.put(`${baseURL}/domains/${id}`, domainData);
        dispatch(updateDomainSuccess(data));
    } catch (err) {
        dispatch(domainFail(err?.response?.data?.message || "Failed to update domain"));
    }
};

// ✅ Delete domain
export const deleteDomain = (id) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        await axios.delete(`${baseURL}/domains/${id}`);
        dispatch(deleteDomainSuccess(id));
    } catch (err) {
        dispatch(domainFail(err?.response?.data?.message || "Failed to delete domain"));
    }
};

export default domainSlice.reducer;
