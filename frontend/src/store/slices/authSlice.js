import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // Fetch user profile immediately after login success
      const profileResponse = await api.get('/users/profile');
      localStorage.setItem('user_role', profileResponse.data.role);
      
      return profileResponse.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userDetails);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      localStorage.setItem('user_role', response.data.role);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to fetch user profile.';
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update profile.';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    role: localStorage.getItem('user_role') || null,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login thunks
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register thunks
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      })
      // Fetch profile thunks
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
      })
      // Update profile thunks
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
