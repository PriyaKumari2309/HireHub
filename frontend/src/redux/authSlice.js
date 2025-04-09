import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    bookmarkedJobs: [], // <-- Add this
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.bookmarkedJobs = action.payload?.bookmarkedJobs || [];
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
