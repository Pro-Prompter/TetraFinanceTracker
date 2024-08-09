import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './auth';

// Thunks
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.getCurrentUser();
            return { authenticated: !!user };
        } catch (error) {
            return rejectWithValue('Failed to check authentication');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            await authService.login({ email, password });
            return { authenticated: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            await authService.createAccount({ email, password, name });
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
            await authService.logout();
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
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to check authentication';
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
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signup.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Signup failed';
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