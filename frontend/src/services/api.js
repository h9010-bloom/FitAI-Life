
import axios from 'axios';

const apiBaseUrl = (
  import.meta.env.VITE_API_URL ||
  'https://fitai-life-backend.onrender.com'
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (config.url && !/^https?:\/\//i.test(config.url)) {
    const endpoint = config.url.startsWith('/')
      ? config.url
      : `/${config.url}`;

    config.url =
      endpoint === '/api' || endpoint.startsWith('/api/')
        ? endpoint
        : `/api${endpoint}`;
  }

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:update'));
    }

    return Promise.reject(error);
  }
);

export default api;
