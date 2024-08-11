// lib/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionsReducer from './transactionsSlice';
import clientsReducer from './clientsSlice';
import profileReducer from './profileSlice';
import commissionsReducer from './commissionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    clients: clientsReducer,
    profile: profileReducer,
    commissions: commissionsReducer,
  },
});

export default store;