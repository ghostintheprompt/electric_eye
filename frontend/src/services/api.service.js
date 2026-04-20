import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (password) => {
    const response = await api.post('/auth/login', { password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Recordings API (to be implemented in Priority 2)
export const recordingsAPI = {
  getRecordings: async (params) => {
    const response = await api.get('/recordings', { params });
    return response.data;
  },

  getRecording: async (filename) => {
    const response = await api.get(`/recordings/${filename}`);
    return response.data;
  },
};

// Incidents API (to be implemented in Priority 3)
export const incidentsAPI = {
  exportIncident: async (data) => {
    const response = await api.post('/incidents/export', data);
    return response.data;
  },

  getIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },
};

export default api;
