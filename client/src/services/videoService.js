import api from './api';

export const getVideos = (params) => api.get('/videos', { params });
export const getMyVideos = () => api.get('/videos/my');
export const getVideoById = (id) => api.get(`/videos/${id}`);
export const createVideo = (data) => api.post('/videos', data);
export const updateVideo = (id, data) => api.put(`/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
export const getVideoStats = () => api.get('/videos/stats');
