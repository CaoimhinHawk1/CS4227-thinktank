import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import UserProfile from './pages/UserProfile';
import ProfileEditor from './pages/ProfileEditor';
import UserSettings from './pages/UserSettings';
import LoginPage from './pages/LoginPage';
import AuthGuard from './components/AuthGuard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appRefreshTrigger, setAppRefreshTrigger] = useState(Date.now());

  // Function to refresh the entire app state
  const refreshAppState = () => {
    setAppRefreshTrigger(Date.now());
  };

  useEffect(() => {
    // Check authentication status on app load and when localStorage changes
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('currentUser');
      
      if (authToken && userId) {
        setCurrentUser(userId);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Also refresh when the app refresh trigger changes
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [appRefreshTrigger]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Route */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={refreshAppState} />} 
          />

          {/* Protected Routes */}
          <Route element={<AuthGuard />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <NavigationBar />
                  <div className="container">
                    <UserProfile userId={currentUser} key={`profile-${appRefreshTrigger}`} />
                  </div>
                </>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <>
                  <NavigationBar />
                  <div className="container">
                    <ProfileEditor userId={currentUser} key={`editor-${appRefreshTrigger}`} />
                  </div>
                </>
              }
            />
            <Route
              path="/preferences"
              element={
                <>
                  <NavigationBar />
                  <div className="container">
                    <UserSettings userId={currentUser} key={`settings-${appRefreshTrigger}`} />
                  </div>
                </>
              }
            />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
