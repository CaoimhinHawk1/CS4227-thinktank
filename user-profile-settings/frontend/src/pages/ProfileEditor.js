import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, saveUserDetails } from '../services/api';

const ProfileEditor = ({ userId }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ fullName: '', emailAddress: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    // Verify authentication
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const userInfo = await fetchUserDetails(userId);
        setProfileData({
          fullName: userInfo.fullName,
          emailAddress: userInfo.emailAddress
        });
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage('Unable to load profile. Please try again later.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMsg(null);

      // Preserve other user fields while updating name & email
      const existingUser = await fetchUserDetails(userId);
      const updatedData = {
        ...existingUser,
        fullName: profileData.fullName,
        emailAddress: profileData.emailAddress
      };

      await saveUserDetails(userId, updatedData);
      setSuccessMsg('Profile updated successfully!');

      // Redirect after a brief confirmation display
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setErrorMessage('Profile update failed. Please try again.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate('/dashboard');

  if (isLoading) return <div className="card">Loading profile details...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Update Profile</h2>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={profileData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailAddress">Email</label>
          <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            value={profileData.emailAddress}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
