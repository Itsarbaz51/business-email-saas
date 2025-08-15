import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import statsReducer from "./slices/statsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    stats: statsReducer,
  },
});

export default store;
