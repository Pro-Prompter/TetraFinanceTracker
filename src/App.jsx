import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./lib/redux/authSlice";
import NavigationBar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Clients from "./components/Clients";
import Transactions from "./components/Transactions";
import TeamCommissions from "./components/TeamCommissions";
import Users from "./components/Users";
import Settings from "./components/Settings";
import Auth from "./lib/Auth";
import ClipLoader from "react-spinners/ClipLoader";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="loading-container">
        <ClipLoader size={150} color="#d2002d" loading={true} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Auth mode="login" /> : <Navigate to="/" />
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <Auth mode="signup" /> : <Navigate to="/" />
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <>
                <NavigationBar />
                <div className="container pt">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route
                      path="/team-commissions"
                      element={<TeamCommissions />}
                    />

                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />

                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
