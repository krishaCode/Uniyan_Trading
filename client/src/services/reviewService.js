import api from './api';

export const getReviews = () => api.get('/reviews');
export const submitReview = (data) => api.post('/reviews', data);