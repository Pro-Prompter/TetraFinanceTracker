// lib/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionsReducer from './transactionsSlice';
import commissionsReducer from './commissionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    commissions: commissionsReducer,
  },
});

export default store;