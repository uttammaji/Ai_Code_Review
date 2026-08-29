import apiClient from './axios';

export const authApi = {
  // ==================== REGISTRATION ====================
  
  // Register new user
  register: async (data) => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  // Verify email with OTP
  verifyOTP: async (data) => {
    const res = await apiClient.post('/auth/verify-otp', data);
    return res.data;
  },

  // Resend verification OTP
  resendOTP: async (email) => {
    const res = await apiClient.post('/auth/resend-otp', { email });
    return res.data;
  },

  // ==================== LOGIN METHODS ====================
  
  // Login with email & password
  login: async (data) => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  // Request OTP for login
  requestLoginOTP: async (email) => {
    const res = await apiClient.post('/auth/login-otp', { email });
    return res.data;
  },

  // Verify login OTP
  verifyLoginOTP: async (data) => {
    const res = await apiClient.post('/auth/verify-login-otp', data);
    return res.data;
  },

  // ==================== USER PROFILE ====================
  
  // Get current user profile
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const res = await apiClient.put('/auth/profile', data);
    return res.data;
  },

  // Delete user account
  deleteAccount: async () => {
    const res = await apiClient.delete('/auth/account');
    return res.data;
  },

  // ==================== LOGOUT ====================
  
  // Logout user
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  }
};

export default authApi;
