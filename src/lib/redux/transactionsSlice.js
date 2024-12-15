import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, ID } from "../appwrite";

const DATABASE_ID = "66ae058300333732f99a";
const COLLECTION_ID = "66b076ea0017936bd88b";

// Fetch Transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Transaction
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        transaction
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Transaction
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction, { rejectWithValue }) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        transaction.$id,
        transaction
      );
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.$id === action.payload.$id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.$id !== action.payload
        );
      });
  },
});

export default transactionsSlice.reducer;