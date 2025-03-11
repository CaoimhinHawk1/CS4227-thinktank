import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // For demo purposes, hardcoded credentials check
    if (username === 'usr_001' && password === 'securepass') {
      // Set auth token and user ID in localStorage
      localStorage.setItem('authToken', 'demo-token-123');
      localStorage.setItem('currentUser', username);
      
      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess && typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to Thintank</h1>
          <p>Sign in to access your research dashboard</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button">Sign In</button>
        </form>
        
        <div className="demo-credentials">
          <p>Demo Login:</p>
          <p>Username: <span>usr_001</span></p>
          <p>Password: <span>securepass</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
