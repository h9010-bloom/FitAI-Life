import api from './api.js';

export const register = (userData) => api.post('/auth/register', userData);

export const login = (credentials) => api.post('/auth/login', credentials);

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return Promise.resolve();
};

export const getProfile = () => api.get('/profile');

export const updateProfile = (profileData) => api.put('/profile', profileData);

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
