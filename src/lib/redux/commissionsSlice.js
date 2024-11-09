import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, ID } from '../appwrite';
import axios from 'axios';

const DATABASE_ID = '66ae058300333732f99a';
const COLLECTION_ID = '66b076ea0017936bd88b';

// Fetch Commissions
export const fetchCommissions = createAsyncThunk(
  'commissions/fetchCommissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Conversion Rates
export const fetchConversionRates = createAsyncThunk(
  'commissions/fetchConversionRates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/pkr.json');
      return response.data;
    } catch (error) {
      // Fallback URL
      try {
        const response = await axios.get('https://latest.currency-api.pages.dev/v1/currencies/pkr.json');
        return response.data;
      } catch (fallbackError) {
        return rejectWithValue('Failed to fetch conversion rates');
      }
    }
  }
);

// Add Commission
export const addCommission = createAsyncThunk(
  'commissions/addCommission',
  async (commission, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), commission);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Commission
export const updateCommission = createAsyncThunk(
  'commissions/updateCommission',
  async (commission, { rejectWithValue }) => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, commission.$id, commission);
      return commission;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Commission
export const deleteCommission = createAsyncThunk(
  'commissions/deleteCommission',
  async (id, { rejectWithValue }) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commissionsSlice = createSlice({
  name: 'commissions',
  initialState: {
    commissions: [],
    conversionRates: {},
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commissions = action.payload;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchConversionRates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversionRates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversionRates = action.payload;
      })
      .addCase(fetchConversionRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.commissions.push(action.payload);
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        const index = state.commissions.findIndex((c) => c.$id === action.payload.$id);
        if (index !== -1) {
          state.commissions[index] = action.payload;
        }
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commissions = state.commissions.filter((c) => c.$id !== action.payload);
      });
  },
});

export default commissionsSlice.reducer;