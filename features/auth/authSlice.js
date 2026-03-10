import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://65.0.29.192:5000/api/auth/signup", formData);
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://65.0.29.192:5000/auth/login", credentials);
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid credentials");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, success: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
        state.success = null; 
      })
      .addCase(signupUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.success = action.payload.message || "Signup successful!"; 
      })
      .addCase(signupUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.success = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => { 
        state.error = action.payload; 
      });
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;