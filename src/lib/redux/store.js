// lib/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionsReducer from './transactionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer
  },
});

export default store;