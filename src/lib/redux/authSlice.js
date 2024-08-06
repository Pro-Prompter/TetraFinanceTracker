import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account } from "../appwrite";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const maxRetries = 3;
      let retries = 0;
      let authenticated = false;

      while (!authenticated && retries < maxRetries) {
        try {
          const session = await account.getSession("current");
          authenticated = !!session;
        } catch (error) {
          retries++;
          console.error(
            `Error checking authentication (attempt ${retries}):`,
            error
          );
        }
      }

      if (!authenticated) {
        return rejectWithValue({
          message: "Failed to check authentication after multiple attempts",
        });
      }

      return { authenticated };
    } catch (error) {
      return rejectWithValue({
        message: "Failed to check authentication",
        error,
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      await account.createEmailPasswordSession(email, password);
      return { authenticated: true };
    } catch (err) {
      throw new Error(err.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }) => {
    try {
      await account.create("unique()", email, password);
      return { authenticated: true };
    } catch (err) {
      throw new Error(err.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await account.deleteSession("current");
    return { authenticated: false };
  } catch (err) {
    throw new Error(err.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = action.payload.authenticated;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload.message || "Failed to check authentication";
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;