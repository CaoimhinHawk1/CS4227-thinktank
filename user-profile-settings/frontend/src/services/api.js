import axios from 'axios';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Get the API URL from environment variables or use a default
const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

console.log('API URL:', BASE_API_URL);
console.log('Environment:', process.env.NODE_ENV);

// Default user data
const defaultUserData = {
  usr_001: {
    userId: 'usr_001',
    fullName: 'Fawad Khan',
    emailAddress: 'fawad.khan@example.com',
    userRole: 'Researcher',
    isProfilePublic: true,
    isNotificationsEnabled: true
  }
};

// Load mock data from localStorage or use defaults
const loadMockData = () => {
  try {
    const savedData = localStorage.getItem('mockUserData');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading mock data from localStorage:', error);
  }
  
  // If no saved data or error, use defaults and save them
  localStorage.setItem('mockUserData', JSON.stringify(defaultUserData));
  return { ...defaultUserData };
};

// In-memory mock data for development
const mockUserData = loadMockData();

// Save mock data to localStorage
const saveMockData = () => {
  try {
    localStorage.setItem('mockUserData', JSON.stringify(mockUserData));
    console.log('Mock data saved to localStorage:', mockUserData);
  } catch (error) {
    console.error('Error saving mock data to localStorage:', error);
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error.message);
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response ? error.response.data : error.message);
  throw error;
};

// Mock API implementation for development
const mockApi = {
  getUser: (userId) => {
    console.log('Mock API: Getting user', userId);
    // Check if we have the user in our mock data
    if (!mockUserData[userId]) {
      console.warn(`User ${userId} not found in mock data, using default`);
      mockUserData[userId] = { ...defaultUserData.usr_001, userId };
      saveMockData();
    }
    return Promise.resolve({ ...mockUserData[userId] });
  },
  
  updateUser: (userId, userData) => {
    console.log('Mock API: Updating user', userId, userData);
    mockUserData[userId] = { ...mockUserData[userId], ...userData };
    saveMockData();
    return Promise.resolve({ ...mockUserData[userId] });
  },
  
  updateVisibility: (userId, isPublic) => {
    console.log('Mock API: Updating visibility', userId, isPublic);
    mockUserData[userId].isProfilePublic = isPublic;
    saveMockData();
    return Promise.resolve({ ...mockUserData[userId] });
  },
  
  updateNotifications: (userId, isEnabled) => {
    console.log('Mock API: Updating notifications', userId, isEnabled);
    mockUserData[userId].isNotificationsEnabled = isEnabled;
    saveMockData();
    return Promise.resolve({ ...mockUserData[userId] });
  }
};

// User Profile API Calls
export const fetchUserDetails = async (userId) => {
  try {
    // Use mock API in development mode
    if (isDevelopment) {
      const data = await mockApi.getUser(userId);
      return data;
    }
    
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user details');
  }
};

export const saveUserDetails = async (userId, userData) => {
  try {
    // Use mock API in development mode
    if (isDevelopment) {
      const data = await mockApi.updateUser(userId, userData);
      return data;
    }
    
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update user profile');
  }
};

// User Settings API Calls
export const updateProfileStatus = async (userId, isPublic) => {
  try {
    console.log(`Updating profile visibility for ${userId} to ${isPublic}`);
    
    // Use mock API in development mode
    if (isDevelopment) {
      const data = await mockApi.updateVisibility(userId, isPublic);
      return data;
    }
    
    const response = await apiClient.patch(`/users/${userId}/visibility`, { isPublic });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update profile visibility');
  }
};

export const updateNotificationSettings = async (userId, isEnabled) => {
  try {
    console.log(`Updating notifications for ${userId} to ${isEnabled}`);
    
    // Use mock API in development mode
    if (isDevelopment) {
      const data = await mockApi.updateNotifications(userId, isEnabled);
      return data;
    }
    
    const response = await apiClient.patch(`/users/${userId}/notifications`, { isEnabled });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update notification settings');
  }
};

// Export API functions
const apiService = {
  fetchUserDetails,
  saveUserDetails,
  updateProfileStatus,
  updateNotificationSettings,
};

export default apiService;
