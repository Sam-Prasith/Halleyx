import api from './api';

const API_URL = '/api/auth';

export const registerUser = async (data) => {
  const response = await api.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post(`${API_URL}/login`, data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
};
