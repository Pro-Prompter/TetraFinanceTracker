import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, ID } from '../appwrite';

const DATABASE_ID = '66ae058300333732f99a';
const COLLECTION_ID = '66b0838f002e59871da5';

// Fetch Clients
export const fetchClients = createAsyncThunk('clients/fetchClients', async (_, { rejectWithValue }) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Add Client
export const addClient = createAsyncThunk('clients/addClient', async (client, { rejectWithValue }) => {
  try {
    // Ensure the client object has the correct keys and handle optional fields
    const payload = {
      Client_Name: client.Client_Name,
      Company_Name: client.Company_Name || '', // Handle optional field
      Project_Name: client.Project_Name,
      Payment_Status: client.Payment_Status
    };

    const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Update Client
export const updateClient = createAsyncThunk('clients/updateClient', async (client, { rejectWithValue }) => {
  try {
    // Ensure the client object has the correct keys and handle optional fields
    const payload = {
      Client_Name: client.Client_Name,
      Company_Name: client.Company_Name || '', // Handle optional field
      Project_Name: client.Project_Name,
      Payment_Status: client.Payment_Status
    };

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, client.$id, payload);
    return { ...client, ...payload }; // Return updated client
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Delete Client
export const deleteClient = createAsyncThunk('clients/deleteClient', async (id, { rejectWithValue }) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex((c) => c.$id === action.payload.$id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter((c) => c.$id !== action.payload);
      });
  },
});

export default clientsSlice.reducer;