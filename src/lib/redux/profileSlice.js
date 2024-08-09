// lib/redux/profileSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  profile: {},
  status: 'idle',
  error: null,
};

// Define async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await fetch('/api/profile'); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  }
);

// Create the slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;