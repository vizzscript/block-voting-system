import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchElections = createAsyncThunk(
  'elections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/elections/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch elections.');
    }
  }
);

export const fetchElectionById = createAsyncThunk(
  'elections/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/elections/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch election details.');
    }
  }
);

export const createElection = createAsyncThunk(
  'elections/create',
  async (electionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/elections/', electionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create election.');
    }
  }
);

export const updateElection = createAsyncThunk(
  'elections/update',
  async ({ id, electionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/elections/${id}`, electionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update election.');
    }
  }
);

export const deleteElection = createAsyncThunk(
  'elections/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/elections/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete election.');
    }
  }
);

export const activateElection = createAsyncThunk(
  'elections/activate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/elections/${id}/activate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to activate election.');
    }
  }
);

export const closeElection = createAsyncThunk(
  'elections/close',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/elections/${id}/close`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to close election.');
    }
  }
);

export const fetchElectionStats = createAsyncThunk(
  'elections/fetchStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/elections/${id}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch election statistics.');
    }
  }
);

const electionSlice = createSlice({
  name: 'elections',
  initialState: {
    elections: [],
    electionDetail: null,
    statistics: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearElectionError: (state) => {
      state.error = null;
    },
    resetElectionSuccess: (state) => {
      state.success = false;
    },
    clearElectionDetail: (state) => {
      state.electionDetail = null;
      state.statistics = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchElections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElections.fulfilled, (state, action) => {
        state.loading = false;
        state.elections = action.payload;
      })
      .addCase(fetchElections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchElectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.electionDetail = action.payload;
      })
      .addCase(fetchElectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createElection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createElection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.elections.push(action.payload);
      })
      .addCase(createElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update
      .addCase(updateElection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateElection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.elections = state.elections.map((e) =>
          e.id === action.payload.id ? action.payload : e
        );
        if (state.electionDetail && state.electionDetail.id === action.payload.id) {
          state.electionDetail = action.payload;
        }
      })
      .addCase(updateElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete
      .addCase(deleteElection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteElection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.elections = state.elections.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Activate
      .addCase(activateElection.fulfilled, (state, action) => {
        state.elections = state.elections.map((e) =>
          e.id === action.payload.id ? action.payload : e
        );
        if (state.electionDetail && state.electionDetail.id === action.payload.id) {
          state.electionDetail = action.payload;
        }
      })
      // Close
      .addCase(closeElection.fulfilled, (state, action) => {
        state.elections = state.elections.map((e) =>
          e.id === action.payload.id ? action.payload : e
        );
        if (state.electionDetail && state.electionDetail.id === action.payload.id) {
          state.electionDetail = action.payload;
        }
      })
      // Fetch stats
      .addCase(fetchElectionStats.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const { clearElectionError, resetElectionSuccess, clearElectionDetail } = electionSlice.actions;
export default electionSlice.reducer;
