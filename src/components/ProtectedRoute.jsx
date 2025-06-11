import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (loading) {
    return null;
  }

  if (currentUser) {
    return <Navigate to={from} replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
