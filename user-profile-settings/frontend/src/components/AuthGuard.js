import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const AuthGuard = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const currentUser = localStorage.getItem('currentUser');
  
  useEffect(() => {
    // If authentication state changes while on a protected route, handle it
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' && !e.newValue) {
        // Token was removed, redirect to login
        navigate('/login', { replace: true });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // Redirect to login if user is not authenticated
  if (!authToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default AuthGuard;
