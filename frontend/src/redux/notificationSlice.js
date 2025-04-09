import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => action.payload,
    addNotification: (state, action) => [action.payload, ...state],
    markAllRead: (state) => state.map((n) => ({ ...n, read: true })),
    clearNotifications: () => [],
  },
});

export const {
  setNotifications,
  addNotification,
  markAllRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
