import api from './api';

export const getUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const approveUser = (id) => api.put(`/users/${id}/approve`);
export const rejectUser = (id) => api.put(`/users/${id}/reject`);
export const suspendUser = (id) => api.put(`/users/${id}/suspend`);
export const getDashboardStats = () => api.get('/users/stats');
export const updateProfile = (data) => api.put('/users/profile', data);
