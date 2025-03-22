import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, ID, Query } from "../appwrite";

const DATABASE_ID = "66ae058300333732f99a";
const COLLECTION_ID = "66b076ea0017936bd88b";
const ITEMS_PER_PAGE = 10;

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async ({ cursor, direction }, { rejectWithValue }) => {
    try {
      const queries = [Query.limit(ITEMS_PER_PAGE), Query.orderDesc("Date")];

      if (cursor) {
        direction === "next"
          ? queries.push(Query.cursorAfter(cursor))
          : queries.push(Query.cursorBefore(cursor));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return {
        documents: response.documents,
        nextCursor:
          response.documents.length >= ITEMS_PER_PAGE
            ? response.documents[response.documents.length - 1].$id
            : null,
        prevCursor:
          response.documents.length > 0 ? response.documents[0].$id : null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc("Date")]
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
    documents: [],
    nextCursor: null,
    prevCursor: null,
    totalIncome: 0,
    totalExpense: 0,
    status: "idle",
    error: null,
    allTransactions: [],
  },
  reducers: {
    resetPagination: (state) => {
      state.documents = [];
      state.nextCursor = null;
      state.prevCursor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.documents = action.payload.documents;
        state.nextCursor = action.payload.nextCursor;
        state.prevCursor = action.payload.prevCursor;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.allTransactions = action.payload;

        // Calculate totalIncome with proper number conversion
        state.totalIncome = action.payload
          .filter((transaction) => transaction.Type === "Income")
          .reduce((sum, transaction) => {
            // Ensure we're adding numbers, not concatenating strings
            return sum + parseFloat(transaction.Amount || 0);
          }, 0);

        // Calculate totalExpense with proper number conversion
        state.totalExpense = action.payload
          .filter((transaction) => transaction.Type === "Expense")
          .reduce((sum, transaction) => {
            // Ensure we're adding numbers, not concatenating strings
            return sum + parseFloat(transaction.Amount || 0);
          }, 0);
      })
      .addCase(addTransaction.fulfilled, (state) => {
        state.status = "idle";
        state.nextCursor = null;
        state.prevCursor = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.documents.findIndex(
          (t) => t.$id === action.payload.$id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (t) => t.$id !== action.payload
        );
      });
  },
});

export const { resetPagination } = transactionsSlice.actions;
export default transactionsSlice.reducer;
