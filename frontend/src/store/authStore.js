import { create } from 'zustand';
import { authApi } from '../api/auth.api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ai_code_review_user') || 'null'),
  token: localStorage.getItem('ai_code_review_token'),
  isAuthenticated: Boolean(localStorage.getItem('ai_code_review_token')),
  loading: false,
  pendingEmail: null,
  demoOtp: null,

  setAuth: (user, token) => {
    localStorage.setItem('ai_code_review_token', token);
    localStorage.setItem('ai_code_review_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  setPendingEmail: (email, demoOtp) => {
    set({ pendingEmail: email, demoOtp: demoOtp || null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('ai_code_review_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      set({ loading: true });
      const data = await authApi.getCurrentUser();
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem('ai_code_review_token');
      localStorage.removeItem('ai_code_review_user');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login({ email, password });
      // If token is returned directly (password login)
      if (res.token && res.user) {
        localStorage.setItem('ai_code_review_token', res.token);
        localStorage.setItem('ai_code_review_user', JSON.stringify(res.user));
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
      set({ pendingEmail: email, demoOtp: res.demoOtp || null, loading: false });
      return { email, demoOtp: res.demoOtp };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.register({ name, email, password });
      set({ pendingEmail: email, demoOtp: res.demoOtp || null, loading: false });
      return { email, demoOtp: res.demoOtp };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  verifyOTP: async (email, otp) => {
    set({ loading: true });
    try {
      const res = await authApi.verifyOTP({ email, otp });
      localStorage.setItem('ai_code_review_token', res.token);
      localStorage.setItem('ai_code_review_user', JSON.stringify(res.user));
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        pendingEmail: null,
        demoOtp: null,
        loading: false
      });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('ai_code_review_token');
    localStorage.removeItem('ai_code_review_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
