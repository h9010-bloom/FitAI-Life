import api from './api.js';

export const register = (userData) => api.post('/api/auth/register', userData);

export const login = (credentials) => api.post('/api/auth/login', credentials);

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return Promise.resolve();
};

export const getProfile = () => api.get('/api/profile');

export const updateProfile = (profileData) => api.put('/api/profile', profileData);

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
