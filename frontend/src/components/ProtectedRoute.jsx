import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If loading user profile, show a simple spinner
  if (loading && !isAuthenticated) {
    return null; // The parent app or layout will show loader
  }

  if (!isAuthenticated) {
    // Redirect to login page but save current location to return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role not authorized, send back to home or safe page
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
