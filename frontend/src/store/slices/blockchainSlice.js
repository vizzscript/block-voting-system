import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===================== VOTING THUNKS =====================

export const castVote = createAsyncThunk(
  'blockchain/castVote',
  async ({ election_id, candidate_id, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/votes/cast', { election_id, candidate_id, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to cast vote.');
    }
  }
);

export const fetchVoteHistory = createAsyncThunk(
  'blockchain/fetchVoteHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/votes/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch vote history.');
    }
  }
);

export const verifyVoteReceipt = createAsyncThunk(
  'blockchain/verifyReceipt',
  async (receiptId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/verify/${receiptId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Receipt verification failed.');
    }
  }
);

// ===================== BLOCKCHAIN EXPLORER THUNKS =====================

export const fetchBlockchain = createAsyncThunk(
  'blockchain/fetchChain',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/blockchain/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to load blockchain.');
    }
  }
);

export const fetchBlockByHash = createAsyncThunk(
  'blockchain/fetchBlock',
  async (hash, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blockchain/block/${hash}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Block not found.');
    }
  }
);

export const validateBlockchain = createAsyncThunk(
  'blockchain/validate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/blockchain/validate');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Validation failed.');
    }
  }
);

// ===================== RESULTS THUNKS =====================

export const fetchElectionResults = createAsyncThunk(
  'blockchain/fetchResults',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/results/${electionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch results.');
    }
  }
);

export const fetchElectionWinner = createAsyncThunk(
  'blockchain/fetchWinner',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/results/${electionId}/winner`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch winner.');
    }
  }
);

export const fetchElectionStatistics = createAsyncThunk(
  'blockchain/fetchStatistics',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/results/${electionId}/statistics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch statistics.');
    }
  }
);

// ===================== SLICE =====================

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState: {
    // Voting
    voteReceipt: null,
    voteHistory: [],
    verificationResult: null,
    
    // Blockchain Explorer
    chain: null,
    selectedBlock: null,
    validationStatus: null,
    
    // Results
    electionResults: null,
    electionWinner: null,
    electionStatistics: null,
    
    // UI State
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearBlockchainError: (state) => {
      state.error = null;
    },
    resetBlockchainSuccess: (state) => {
      state.success = false;
    },
    clearVoteReceipt: (state) => {
      state.voteReceipt = null;
    },
    clearVerification: (state) => {
      state.verificationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cast Vote
      .addCase(castVote.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(castVote.fulfilled, (state, action) => {
        state.loading = false;
        state.voteReceipt = action.payload;
        state.success = true;
      })
      .addCase(castVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote History
      .addCase(fetchVoteHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchVoteHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.voteHistory = action.payload;
      })
      .addCase(fetchVoteHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Receipt
      .addCase(verifyVoteReceipt.pending, (state) => { state.loading = true; state.verificationResult = null; })
      .addCase(verifyVoteReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyVoteReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Blockchain
      .addCase(fetchBlockchain.pending, (state) => { state.loading = true; })
      .addCase(fetchBlockchain.fulfilled, (state, action) => {
        state.loading = false;
        state.chain = action.payload;
      })
      .addCase(fetchBlockchain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Block Detail
      .addCase(fetchBlockByHash.fulfilled, (state, action) => {
        state.selectedBlock = action.payload;
      })
      // Validate
      .addCase(validateBlockchain.pending, (state) => { state.loading = true; })
      .addCase(validateBlockchain.fulfilled, (state, action) => {
        state.loading = false;
        state.validationStatus = action.payload;
      })
      .addCase(validateBlockchain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Results
      .addCase(fetchElectionResults.pending, (state) => { state.loading = true; })
      .addCase(fetchElectionResults.fulfilled, (state, action) => {
        state.loading = false;
        state.electionResults = action.payload;
      })
      .addCase(fetchElectionResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Winner
      .addCase(fetchElectionWinner.fulfilled, (state, action) => {
        state.electionWinner = action.payload;
      })
      // Statistics
      .addCase(fetchElectionStatistics.fulfilled, (state, action) => {
        state.electionStatistics = action.payload;
      });
  },
});

export const { clearBlockchainError, resetBlockchainSuccess, clearVoteReceipt, clearVerification } = blockchainSlice.actions;
export default blockchainSlice.reducer;
