// src/services/api.jsx
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const businessApi = {
  getAll: () => api.get('/businesses/'),
  getNearby: (lat, lng, radius) => api.get(`/nearby-businesses/?lat=${lat}&lng=${lng}&radius=${radius}`),
  getById: (id) => api.get(`/businesses/${id}/`),
  create: (data) => api.post('/businesses/', data),
  update: (id, data) => api.put(`/businesses/${id}/`, data),
  delete: (id) => api.delete(`/businesses/${id}/`),
};

export const productApi = {
  getAll: () => api.get('/products/'),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  getBySeller: (sellerId) => api.get(`/products/?seller=${sellerId}`),
};

export const serviceApi = {
  getAll: () => api.get('/services/'),
  getNearby: (lat, lng, radius) => api.get(`/services/?lat=${lat}&lng=${lng}&radius=${radius}`),
  getById: (id) => api.get(`/services/${id}/`),
  create: (data) => api.post('/services/', data),
  update: (id, data) => api.put(`/services/${id}/`, data),
  delete: (id) => api.delete(`/services/${id}/`),
  getByProvider: (providerId) => api.get(`/services/?provider=${providerId}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories/'),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  profile: () => api.get('/auth/profile/'),
};

export const aiApi = {
  enhanceText: (text) => api.post('/ai/enhance-text/', { text }),
  generateTags: (text) => api.post('/ai/generate-tags/', { text }),
  getSuggestions: (text) => api.post('/ai/get-suggestions/', { text }),
};

export const adminApi = {
  verifyService: (id) => api.post(`/services/${id}/verify/`),
  getPendingServices: () => api.get('/services/?verified=false'),
  verify: (id) => api.post(`/services/${id}/verify/`),
  getAvailability: (serviceId) => api.get(`/availability/?service=${serviceId}`),
};

export default api;