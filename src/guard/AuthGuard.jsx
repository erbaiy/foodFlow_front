import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role is required and user doesn't have it, redirect based on user's actual role
  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'superAdmin') {
      return <Navigate to="/dashboard/super-admin" replace />;
    } else if (user?.role === 'restaurantManager') {
      return <Navigate to="/dashboard/restaurant-manager" replace />;
    } else {
      // Regular user/client
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (or no specific role is required)
  return children;
};

export default AuthGuard;