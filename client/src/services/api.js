import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

// Add a request interceptor to add the auth token to every request
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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
