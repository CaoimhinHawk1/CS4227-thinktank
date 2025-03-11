import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, updateProfileStatus, updateNotificationSettings } from '../services/api';
import './SettingsPage.css';

const UserSettings = ({ userId }) => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    isProfilePublic: false,
    isNotificationsEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isUpdating, setIsUpdating] = useState({
    visibility: false,
    notifications: false
  });

  // Function to load user settings
  const loadUserSettings = async (targetUserId) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      const userInfo = await fetchUserDetails(targetUserId);
      console.log('Loaded user settings:', userInfo);
      
      if (userInfo) {
        setPreferences({
          isProfilePublic: userInfo.isProfilePublic,
          isNotificationsEnabled: userInfo.isNotificationsEnabled,
        });
      } else {
        throw new Error('Failed to load user settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setErrorMsg('Unable to load user settings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!authToken || !currentUser) {
      navigate('/login');
      return;
    }

    // Load user settings
    const targetUserId = userId || currentUser;
    loadUserSettings(targetUserId);

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'mockUserData') {
        console.log('Mock user data changed, reloading settings');
        loadUserSettings(targetUserId);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId, navigate]);

  const handleProfileVisibilityChange = async (e) => {
    const updatedVisibility = e.target.checked;
    
    // Immediately update UI for better user experience
    setPreferences(prev => ({
      ...prev,
      isProfilePublic: updatedVisibility
    }));
    
    try {
      // Set updating state for this specific toggle
      setIsUpdating(prev => ({ ...prev, visibility: true }));
      setErrorMsg(null);
      setSuccessMsg(null);

      // Get current user ID from localStorage if not provided
      const currentUser = localStorage.getItem('currentUser');
      const targetUserId = userId || currentUser;

      console.log(`Updating profile visibility for user ${targetUserId} to ${updatedVisibility}`);
      const updatedUser = await updateProfileStatus(targetUserId, updatedVisibility);
      
      if (updatedUser) {
        console.log('Updated user data:', updatedUser);
        // Ensure state reflects server response
        setPreferences(prev => ({
          ...prev,
          isProfilePublic: updatedUser.isProfilePublic
        }));
        
        // Dispatch a storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'mockUserData',
          newValue: localStorage.getItem('mockUserData')
        }));
        
        setSuccessMsg('Profile visibility updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('Failed to update profile visibility');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      
      // Revert UI if update failed
      setPreferences(prev => ({
        ...prev,
        isProfilePublic: !updatedVisibility
      }));
      
      setErrorMsg('Error updating profile visibility. Please try again.');
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      // Reset updating state for this specific toggle
      setIsUpdating(prev => ({ ...prev, visibility: false }));
    }
  };

  const handleNotificationToggle = async (e) => {
    const updatedNotifications = e.target.checked;
    
    // Immediately update UI for better user experience
    setPreferences(prev => ({
      ...prev,
      isNotificationsEnabled: updatedNotifications
    }));
    
    try {
      // Set updating state for this specific toggle
      setIsUpdating(prev => ({ ...prev, notifications: true }));
      setErrorMsg(null);
      setSuccessMsg(null);

      // Get current user ID from localStorage if not provided
      const currentUser = localStorage.getItem('currentUser');
      const targetUserId = userId || currentUser;

      console.log(`Updating notification settings for user ${targetUserId} to ${updatedNotifications}`);
      const updatedUser = await updateNotificationSettings(targetUserId, updatedNotifications);
      
      if (updatedUser) {
        console.log('Updated user data:', updatedUser);
        // Ensure state reflects server response
        setPreferences(prev => ({
          ...prev,
          isNotificationsEnabled: updatedUser.isNotificationsEnabled
        }));
        
        // Dispatch a storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'mockUserData',
          newValue: localStorage.getItem('mockUserData')
        }));
        
        setSuccessMsg('Notification settings updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      
      // Revert UI if update failed
      setPreferences(prev => ({
        ...prev,
        isNotificationsEnabled: !updatedNotifications
      }));
      
      setErrorMsg('Error updating notification preferences. Please try again.');
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      // Reset updating state for this specific toggle
      setIsUpdating(prev => ({ ...prev, notifications: false }));
    }
  };

  if (isLoading) return <div className="card">Loading settings...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Settings</h2>
      </div>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="settings-container">
        <div className="setting-option">
          <div className="setting-details">
            <h3>Profile Visibility</h3>
            <p>Allow others to view your profile.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.isProfilePublic}
              onChange={handleProfileVisibilityChange}
              disabled={isUpdating.visibility || isUpdating.notifications}
            />
            <span className="slider"></span>
          </label>
          <div className="setting-status">
            <strong>{preferences.isProfilePublic ? 'Public' : 'Private'}</strong>
          </div>
        </div>

        <div className="setting-option">
          <div className="setting-details">
            <h3>Notifications</h3>
            <p>Receive updates and alerts.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.isNotificationsEnabled}
              onChange={handleNotificationToggle}
              disabled={isUpdating.visibility || isUpdating.notifications}
            />
            <span className="slider"></span>
          </label>
          <div className="setting-status">
            <strong>{preferences.isNotificationsEnabled ? 'Enabled' : 'Disabled'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
