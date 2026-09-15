import api from './api.js';

export const fetchExercises = () => api.get('/exercises');
export const createExercise = (data) => api.post('/exercises', data);
export const updateExercise = (id, data) => api.put(`/exercises/${id}`, data);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);
