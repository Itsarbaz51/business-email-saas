// src/redux/slices/statsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  domains: [
    { id: 1, name: 'example.com', mailboxes: 5, status: 'active' },
    { id: 2, name: 'testmail.org', mailboxes: 2, status: 'pending' },
  ],
  mailboxes: [
    { id: 1, address: 'support@example.com' },
    { id: 2, address: 'sales@testmail.org' },
  ],
  users: [
    { id: 1, name: 'Admin One' },
    { id: 2, name: 'Admin Two' },
  ],
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats(state, action) {
      const { domains, mailboxes, users } = action.payload;
      state.domains = domains || [];
      state.mailboxes = mailboxes || [];
      state.users = users || [];
    },
  },
});

export const { setStats } = statsSlice.actions;
export default statsSlice.reducer;
