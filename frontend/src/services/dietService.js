import api from './api.js';

export const fetchDiets = () => api.get('/diets');
export const createDiet = (data) => api.post('/diets', data);
export const updateDiet = (id, data) => api.put(`/diets/${id}`, data);
export const deleteDiet = (id) => api.delete(`/diets/${id}`);
