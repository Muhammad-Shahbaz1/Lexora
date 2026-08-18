import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
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
