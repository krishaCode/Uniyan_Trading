import api from './api';

export const submitContact = (data) => api.post('/contact', data);
export const getMessages = (params) => api.get('/contact', { params });
export const getMessageById = (id) => api.get(`/contact/${id}`);
export const markAsRead = (id) => api.put(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);
