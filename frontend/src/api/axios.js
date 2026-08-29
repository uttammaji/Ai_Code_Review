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

// Request interceptor - Add token to headers
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

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    // You can handle successful responses here if needed
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('ai_code_review_token');
        localStorage.removeItem('ai_code_review_user');
        
        // Avoid redirect loop
        const pathname = window.location.pathname;
        const isAuthPage = pathname.startsWith('/login') || 
                          pathname.startsWith('/register') || 
                          pathname === '/';
        
        if (!isAuthPage) {
          window.location.href = '/login?expired=true';
        }
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.warn('Access forbidden:', data?.message || 'You do not have permission');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.warn('Resource not found:', data?.message || 'Not found');
      }
      
      // Handle 500 Server Error
      if (status === 500) {
        console.error('Server error:', data?.message || 'Internal server error');
      }
      
      // Handle 429 Too Many Requests
      if (status === 429) {
        console.warn('Rate limit exceeded:', data?.message || 'Too many requests');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
