import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchUserDetails } from '../services/api';

const UserProfile = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Function to refresh user data
  const refreshUserData = useCallback(() => {
    console.log('Refreshing user data...');
    setLastRefresh(Date.now());
  }, []);

  // Load user profile data
  const loadUserProfile = useCallback(async (targetUserId) => {
    try {
      setIsLoading(true);
      console.log(`Loading profile for user: ${targetUserId}`);
      const userInfo = await fetchUserDetails(targetUserId);
      console.log('Loaded user profile:', userInfo);
      
      // Update user data with the latest information
      setUserData(userInfo);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Unable to retrieve user details. Please try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ensure user is authenticated
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!authToken || !currentUser) {
      navigate('/login');
      return;
    }

    const targetUserId = userId || currentUser;
    loadUserProfile(targetUserId);

    // Add event listener for focus to refresh data when user returns to the tab
    const handleFocus = () => refreshUserData();
    window.addEventListener('focus', handleFocus);
    
    // Add event listener for navigation events
    const handleNavigation = (event) => {
      if (event.detail.destination === '/dashboard') {
        console.log('Navigation to dashboard detected, refreshing data...');
        refreshUserData();
      }
    };
    window.addEventListener('app-navigation', handleNavigation);
    
    // Add event listener for storage changes (for mock data updates)
    const handleStorageChange = (e) => {
      if (e.key === 'mockUserData') {
        console.log('Mock user data changed, refreshing profile');
        refreshUserData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('app-navigation', handleNavigation);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId, navigate, lastRefresh, loadUserProfile, refreshUserData]);

  // Effect to refresh data when navigating back to this page
  useEffect(() => {
    const handleNavigation = () => {
      if (location.pathname === '/dashboard') {
        refreshUserData();
      }
    };

    handleNavigation();
  }, [location, refreshUserData]);

  if (isLoading) return <div className="card">Loading profile details...</div>;
  if (errorMsg) return <div className="alert alert-danger">{errorMsg}</div>;
  if (!userData) return <div className="alert alert-danger">User not found</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Overview</h2>
          <div className="button-group">
            <Link to="/edit-profile">
              <button className="edit-btn">Edit Profile</button>
            </Link>
          </div>
        </div>

        <div className="profile-details">
          <div className="info-group">
            <label>Full Name</label>
            <p>{userData.fullName}</p>
          </div>

          <div className="info-group">
            <label>Email Address</label>
            <p>{userData.emailAddress}</p>
          </div>

          <div className="info-group">
            <label>User Role</label>
            <p>{userData.userRole}</p>
          </div>

          <div className="info-group">
            <label>Profile Status</label>
            <p className={userData.isProfilePublic ? 'status-active' : 'status-inactive'}>
              {userData.isProfilePublic ? 'Public' : 'Private'}
            </p>
          </div>

          <div className="info-group">
            <label>Notifications</label>
            <p className={userData.isNotificationsEnabled ? 'status-active' : 'status-inactive'}>
              {userData.isNotificationsEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
