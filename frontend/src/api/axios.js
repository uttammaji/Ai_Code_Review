import axios from 'axios';

const metaEnv = (import.meta && import.meta.env) ? import.meta.env : {};

// If VITE_API_URL is configured (e.g. on Vercel), use it. Otherwise default to '/api' for local proxy
let baseURL = metaEnv.VITE_API_URL ? metaEnv.VITE_API_URL.replace(/\/$/, '') : '/api';

// If VITE_API_URL is provided without '/api' suffix (e.g. 'https://my-backend.onrender.com'), append '/api'
if (metaEnv.VITE_API_URL && !baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ai_code_review_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('ai_code_review_token');
        localStorage.removeItem('ai_code_review_user');
        const pathname = window.location.pathname;
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
