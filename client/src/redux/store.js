import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import subscribeReducer from "./slices/subscriptionSlice.js";
import domainReducer from "./slices/domainSlice.js";
import statsReducer from "./slices/statsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    subscribe: subscribeReducer,
    domain: domainReducer,
    stats: statsReducer,
  },
});

export default store;
