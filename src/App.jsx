import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './lib/redux/authSlice';
import NavigationBar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Transactions from './components/Transactions';
import Savings from './components/Savings';
import PendingPayments from './components/PendingPayments';
import TeamCommissions from './components/TeamCommissions';
import RevenueSources from './components/RevenueSources';
import Reports from './components/Reports';
import Users from './components/Users';
import Settings from './components/Settings';
import Auth from './lib/Auth';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Auth mode="login" /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Auth mode="signup" /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={isAuthenticated ? (
            <>
              <NavigationBar />
              <div className="container mt-3">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/savings" element={<Savings />} />
                  <Route path="/pending-payments" element={<PendingPayments />} />
                  <Route path="/team-commissions" element={<TeamCommissions />} />
                  <Route path="/revenue-sources" element={<RevenueSources />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </div>
  );
};

export default App;