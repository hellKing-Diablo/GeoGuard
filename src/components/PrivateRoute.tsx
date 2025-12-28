import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. Wait until Firebase figures out if we are logged in
  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // 2. If no user, kick them to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 3. If user exists, show the protected page
  return <>{children}</>;
};

export default PrivateRoute;