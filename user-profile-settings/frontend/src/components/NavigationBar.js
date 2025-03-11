import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NavigationBar = () => {
  const currentPath = useLocation().pathname;
  const redirect = useNavigate();

  const logoutUser = (e) => {
    e.preventDefault();
    
    // First, notify any listeners that we're logging out
    window.dispatchEvent(new CustomEvent('user-logout'));
    
    // Use setTimeout to ensure state updates have time to propagate
    setTimeout(() => {
      try {
        // Clear authentication details
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProfilePublic');
        localStorage.removeItem('userNotificationsEnabled');
        
        // Use window.location for a full page refresh to avoid React Router issues
        window.location.href = '/login';
      } catch (error) {
        console.error('Error during logout:', error);
        // Fallback if the redirect fails
        redirect('/login');
      }
    }, 100);
  };

  // Function to handle navigation with data refresh
  const handleNavigation = (path) => {
    // Trigger a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('app-navigation', { 
      detail: { destination: path } 
    }));
    
    // Navigate to the path
    redirect(path);
  };

  return (
    <nav className="navigation">
      <div className="nav-wrapper">
        <div className="brand-logo">
          <Link to="/dashboard">User Hub</Link>
        </div>
        <ul className="nav-links">
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className={currentPath === '/dashboard' || currentPath === '/' ? 'active-link' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/dashboard');
              }}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/preferences" 
              className={currentPath === '/preferences' ? 'active-link' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/preferences');
              }}
            >
              Preferences
            </Link>
          </li>
          <li className="nav-item">
            <a href="/login" onClick={logoutUser} className="logout-btn">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
