import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (!user.Auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user's role is in the allowedRoles array
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to home if the role is not allowed
  }

  return children;
};

export default ProtectedRoute;
