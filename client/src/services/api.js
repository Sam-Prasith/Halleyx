import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('halleyx_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (_) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('halleyx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
