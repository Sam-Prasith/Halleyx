import api from './api';

const API_URL = '/api/dashboard';

export const getDashboardLayout = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const saveDashboardLayout = async (widgets) => {
  const response = await api.post(API_URL, { widgets });
  return response.data;
};

export const updateDashboardLayout = async (widgets) => {
  const response = await api.put(API_URL, { widgets });
  return response.data;
};
