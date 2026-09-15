import api from './api.js';

export const sendMessage = (data) => api.post('/chat', data);
export const fetchChatHistory = () => api.get('/chat/history');
export const deleteChatHistory = () => api.delete('/chat/history');
