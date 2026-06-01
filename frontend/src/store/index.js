import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidateReducer from './slices/candidateSlice';
import electionReducer from './slices/electionSlice';
import blockchainReducer from './slices/blockchainSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidateReducer,
    elections: electionReducer,
    blockchain: blockchainReducer,
  },
});
