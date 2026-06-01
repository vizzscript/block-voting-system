import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { search, department, position } = filters;
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (position) params.position = position;
      
      const response = await api.get('/candidates/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch candidates.');
    }
  }
);

export const fetchCandidateById = createAsyncThunk(
  'candidates/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch candidate details.');
    }
  }
);

export const createCandidate = createAsyncThunk(
  'candidates/create',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await api.post('/candidates/', candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add candidate.');
    }
  }
);

export const updateCandidate = createAsyncThunk(
  'candidates/update',
  async ({ id, candidateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/candidates/${id}`, candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update candidate.');
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/candidates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete candidate.');
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    candidateDetail: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCandidateError: (state) => {
      state.error = null;
    },
    resetCandidateSuccess: (state) => {
      state.success = false;
    },
    clearCandidateDetail: (state) => {
      state.candidateDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateDetail = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.candidates.push(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.candidates = state.candidates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
        if (state.candidateDetail && state.candidateDetail.id === action.payload.id) {
          state.candidateDetail = action.payload;
        }
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.candidates = state.candidates.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCandidateError, resetCandidateSuccess, clearCandidateDetail } = candidateSlice.actions;
export default candidateSlice.reducer;
