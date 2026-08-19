import axios from 'axios';

// Smart API URL: Use env if defined, otherwise detect if on Vercel vs Localhost
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://lexora-production-b21a.up.railway.app/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamic base URL on every request to guarantee correct environment
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('lexora_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - cleanly pass error to callers without forceful window redirect loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Contracts API
export const contractsAPI = {
  upload: (formData: FormData) =>
    api.post('/contracts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (params?: { page?: number; limit?: number; category?: string; status?: string }) =>
    api.get('/contracts', { params }),
  getOne: (id: string) => api.get(`/contracts/${id}`),
  delete: (id: string) => api.delete(`/contracts/${id}`),
  reanalyze: (id: string) => api.post(`/contracts/${id}/reanalyze`),
};

export default api;
