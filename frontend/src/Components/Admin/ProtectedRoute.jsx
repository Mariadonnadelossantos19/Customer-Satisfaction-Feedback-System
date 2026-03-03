import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../../api/axiosConfig';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute; 