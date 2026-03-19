import api from './api';

const API_URL = '/api/orders';

export const getOrders = async (date) => {
  const params = date ? { date } : {};
  const response = await api.get(API_URL, { params });
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post(API_URL, orderData);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await api.put(`${API_URL}/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
