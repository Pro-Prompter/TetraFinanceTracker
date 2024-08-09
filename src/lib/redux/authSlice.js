import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from './auth';
// Thunks
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
           const res = await auth.getCurrentUser();
            if(res) {

                return { authenticated: true};
            }
            return {authenticated : false}
        } catch (error) {
            return {authenticated : false}
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
           const res = await auth.login({ email, password });
           if(res) {
               return { authenticated: true };
           }
           return { authenticated : false}
        } catch (error) {
            alert(error)
            return rejectWithValue(error.message);
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            await auth.createAccount({ email, password, name });
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
            await auth.logout();
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
            .addCase(login.fulfilled, (state , action) => {
                state.status = 'succeeded';
                state.isAuthenticated = action.payload.authenticated;
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