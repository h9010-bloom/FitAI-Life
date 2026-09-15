import api from './api.js';

export const fetchProgress = () => api.get('/progress');
export const addProgress = (data) => api.post('/progress', data);
export const updateProgress = (id, data) => api.put(`/progress/${id}`, data);
export const deleteProgress = (id) => api.delete(`/progress/${id}`);
