import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { account, databases } from '../appwrite';

// Define initial state
const initialState = {
  profile: {},
  status: 'idle',
  error: null,
};

// Define async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await account.get(); // Fetch current user info
      const userName = user.name; // Extract the user name

      // Prepare the query object
      const query = [
        {
          key: 'User_Name',
          value: userName,
          operator: 'equal'
        }
      ];

      // URL-encode the query
      const queryString = encodeURIComponent(JSON.stringify(query));

      // Fetch the user's document from the Users collection
      const profileResponse = await databases.listDocuments(
        '66ae058300333732f99a', // Database ID
        '66ae05a1002d7b4e35f7', // Collection ID
        { queries: queryString } // Pass the query as a URL-encoded JSON string
      );

      if (profileResponse.documents.length > 0) {
        return profileResponse.documents[0];
      } else {
        throw new Error('Profile not found');
      }
      
    } catch (error) {
      console.error('Fetch profile error:', error.message);
      return rejectWithValue(error.message);
    }
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
        state.profile = action.payload; // Update state with profile data
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Set error message if request fails
      });
  },
});

export default profileSlice.reducer;