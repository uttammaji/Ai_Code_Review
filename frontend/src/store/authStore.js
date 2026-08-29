import { create } from 'zustand';
import { authApi } from '../api/auth.api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('ai_code_review_user') || 'null'),
  token: localStorage.getItem('ai_code_review_token'),
  isAuthenticated: Boolean(localStorage.getItem('ai_code_review_token')),
  loading: false,
  pendingEmail: localStorage.getItem('ai_code_review_pending_email') || null,
  demoOtp: null,

  // Set auth data
  setAuth: (user, token) => {
    localStorage.setItem('ai_code_review_token', token);
    localStorage.setItem('ai_code_review_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  // Check auth status
  checkAuth: async () => {
    const token = localStorage.getItem('ai_code_review_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      set({ loading: true });
      const data = await authApi.getCurrentUser();
      if (data.success) {
        set({ user: data.user, isAuthenticated: true, loading: false });
      }
    } catch {
      localStorage.removeItem('ai_code_review_token');
      localStorage.removeItem('ai_code_review_user');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  // ============ LOGIN WITH PASSWORD ============
  // Calls: POST /api/auth/login with { email, password }
  loginWithPassword: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login({ email, password });
      
      if (res.success && res.token && res.user) {
        localStorage.setItem('ai_code_review_token', res.token);
        localStorage.setItem('ai_code_review_user', JSON.stringify(res.user));
        localStorage.removeItem('ai_code_review_pending_email');
        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          pendingEmail: null,
          demoOtp: null,
          loading: false,
        });
        return { success: true, user: res.user, token: res.token };
      }
      
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ LOGIN WITH OTP (Request OTP) ============
  // Calls: POST /api/auth/login-otp with { email }
  loginWithOTP: async (email) => {
    set({ loading: true });
    try {
      // IMPORTANT: Call requestLoginOTP, NOT login
      const res = await authApi.requestLoginOTP(email);
      
      if (res.success) {
        localStorage.setItem('ai_code_review_pending_email', email);
        set({ 
          pendingEmail: email, 
          demoOtp: res.demoOtp || null, 
          loading: false 
        });
        return { success: true, email, demoOtp: res.demoOtp };
      }
      
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ VERIFY LOGIN OTP ============
  // Calls: POST /api/auth/verify-login-otp with { email, otp }
  verifyLoginOTP: async (email, otp) => {
    set({ loading: true });
    try {
      const res = await authApi.verifyLoginOTP({ email, otp });
      
      if (res.success && res.token && res.user) {
        localStorage.setItem('ai_code_review_token', res.token);
        localStorage.setItem('ai_code_review_user', JSON.stringify(res.user));
        localStorage.removeItem('ai_code_review_pending_email');
        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          pendingEmail: null,
          demoOtp: null,
          loading: false
        });
        return res;
      }
      
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ REGISTER ============
  // Calls: POST /api/auth/register with { name, email, password }
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.register({ name, email, password });
      
      if (res.success) {
        localStorage.setItem('ai_code_review_pending_email', email);
        set({ 
          pendingEmail: email, 
          demoOtp: res.demoOtp || null, 
          loading: false 
        });
        return { success: true, email, demoOtp: res.demoOtp };
      }
      
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ VERIFY REGISTRATION OTP ============
  // Calls: POST /api/auth/verify-otp with { email, otp }
  verifyRegistrationOTP: async (email, otp) => {
    set({ loading: true });
    try {
      const res = await authApi.verifyOTP({ email, otp });
      
      if (res.success && res.token && res.user) {
        localStorage.setItem('ai_code_review_token', res.token);
        localStorage.setItem('ai_code_review_user', JSON.stringify(res.user));
        localStorage.removeItem('ai_code_review_pending_email');
        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          pendingEmail: null,
          demoOtp: null,
          loading: false
        });
        return res;
      }
      
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ RESEND OTP ============
  // Calls: POST /api/auth/resend-otp with { email }
  resendOTP: async (email) => {
    set({ loading: true });
    try {
      const res = await authApi.resendOTP(email);
      set({ 
        demoOtp: res.demoOtp || null, 
        loading: false 
      });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // ============ LOGOUT ============
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      localStorage.removeItem('ai_code_review_token');
      localStorage.removeItem('ai_code_review_user');
      localStorage.removeItem('ai_code_review_pending_email');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        pendingEmail: null,
        demoOtp: null
      });
    }
  },
}));

export default useAuthStore;
