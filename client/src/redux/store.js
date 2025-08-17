import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import subscribeReducer from "./slices/subscriptionSlice.js";
import domainReducer from "./slices/domainSlice.js";
import mailboxReducer from "./slices/mailboxSlice.js";
import mailReducer from "./slices/mailSlice.js";
import statsReducer from "./slices/statsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    subscribe: subscribeReducer,
    domain: domainReducer,
    mailbox: mailboxReducer,
    mail: mailReducer,
    stats: statsReducer,
  },
});

export default store;
