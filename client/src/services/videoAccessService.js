import api from './api';

export const grantAccess = (data) => api.post('/video-access', data);
export const grantBulkAccess = (data) => api.post('/video-access/bulk', data);
export const getUserVideoAccess = (userId) => api.get(`/video-access/user/${userId}`);
export const getAllVideosWithAccessStatus = (userId) => api.get(`/video-access/user/${userId}/all`);
export const revokeAccess = (id) => api.delete(`/video-access/${id}`);
export const revokeAccessByUserVideo = (userId, videoId) => api.delete(`/video-access/user/${userId}/video/${videoId}`);
