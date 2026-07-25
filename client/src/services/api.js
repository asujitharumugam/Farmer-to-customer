import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token from local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('farm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global 401 unauthenticated errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/me')) {
        localStorage.removeItem('farm_token');
        localStorage.removeItem('farm_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
