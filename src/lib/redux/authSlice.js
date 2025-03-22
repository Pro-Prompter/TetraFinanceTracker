import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Client, Account } from 'appwrite';

// Set up Appwrite Client
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("66adcdf60024b7054a30"); // Your Appwrite endpoint and project ID
const account = new Account(client);

// Thunks
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const user = await account.get();
            return { authenticated: !!user };
        } catch (error) {
            return { authenticated: false };
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            await account.createEmailPasswordSession(email, password);
            return { authenticated: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await account.deleteSession("current");
            return { authenticated: false };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = action.payload.authenticated;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to check authentication';
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Logout failed';
            });
    },
});

export default authSlice.reducer;