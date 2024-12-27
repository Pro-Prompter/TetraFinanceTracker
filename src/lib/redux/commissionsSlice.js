import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, ID } from '../appwrite';

// Constants for Database and Collection IDs
const DATABASE_ID = '66ae058300333732f99a';
const COMMISSIONS_COLLECTION_ID = '66b076ea0017936bd88b';
const TRANSACTIONS_COLLECTION_ID = '66b076ea0017936bd88b';

// Helper function to fetch data from a collection
const fetchFromCollection = async (collectionId) => {
  const response = await databases.listDocuments(DATABASE_ID, collectionId);
  return response.documents;
};

// Fetch Commissions including related Project Names
export const fetchCommissions = createAsyncThunk(
  'commissions/fetchCommissions',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch commissions and transactions
      const [commissions, transactions] = await Promise.all([
        fetchFromCollection(COMMISSIONS_COLLECTION_ID),
        fetchFromCollection(TRANSACTIONS_COLLECTION_ID)
      ]);

      // Map transaction IDs to Project Names for easy lookup
      const projectNames = transactions.reduce((acc, { $id, ProjectName }) => {
        acc[$id] = ProjectName;
        return acc;
      }, {});

      // Combine commissions with project names
      return commissions.map((commission) => ({
        ...commission,
        ProjectName: projectNames[commission.ProjectName] || 'N/A', // Default to 'N/A' if no match
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Commission
export const addCommission = createAsyncThunk(
  'commissions/addCommission',
  async (commission, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COMMISSIONS_COLLECTION_ID,
        ID.unique(),
        commission
      );
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
      await databases.updateDocument(
        DATABASE_ID,
        COMMISSIONS_COLLECTION_ID,
        commission.$id,
        commission
      );
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
      await databases.deleteDocument(DATABASE_ID, COMMISSIONS_COLLECTION_ID, id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Commission slice
const commissionsSlice = createSlice({
  name: 'commissions',
  initialState: {
    commissions: [],
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