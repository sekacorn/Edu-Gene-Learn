import axios from 'axios';

// API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================

export const login = (credentials) => {
  return apiClient.post('/api/v1/auth/login', credentials);
};

export const register = (userData) => {
  return apiClient.post('/api/v1/auth/register', userData);
};

export const logout = () => {
  return apiClient.post('/api/v1/auth/logout');
};

// =============================================================================
// GENOMIC DATA APIs
// =============================================================================

export const uploadGenomicData = (formData, onUploadProgress) => {
  return apiClient.post('/api/v1/genomic-data/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getUserGenomicData = (userId) => {
  return apiClient.get(`/api/v1/genomic-data/user/${userId}`);
};

export const processGenomicData = (genomicDataId) => {
  return apiClient.post(`/api/v1/genomic-data/${genomicDataId}/process`);
};

// =============================================================================
// AI PREDICTIONS APIs
// =============================================================================

export const getLearningRecommendations = (profileData) => {
  return apiClient.post('/api/v1/predictions/learning-profile', profileData);
};

// =============================================================================
// LLM SERVICE APIs
// =============================================================================

export const queryLLM = (queryData) => {
  return apiClient.post('/api/v1/llm/query', queryData);
};

export const troubleshoot = (errorData) => {
  return apiClient.post('/api/v1/llm/troubleshoot', errorData);
};

// =============================================================================
// VISUALIZATION APIs
// =============================================================================

export const getVisualizations = (userId) => {
  return apiClient.get(`/api/v1/visualizations/user/${userId}`);
};

export const createVisualization = (visualizationData) => {
  return apiClient.post('/api/v1/visualizations', visualizationData);
};

export const exportVisualization = (visualizationId, format) => {
  return apiClient.get(`/api/v1/visualizations/${visualizationId}/export`, {
    params: { format },
    responseType: 'blob',
  });
};

// =============================================================================
// COLLABORATION APIs
// =============================================================================

export const createCollaborationSession = (sessionData) => {
  return apiClient.post('/api/v1/collaboration/sessions', sessionData);
};

export const joinCollaborationSession = (sessionId, userId) => {
  return apiClient.post(`/api/v1/collaboration/sessions/${sessionId}/join`, { userId });
};

export const getCollaborationSessions = (userId) => {
  return apiClient.get(`/api/v1/collaboration/sessions/user/${userId}`);
};

// =============================================================================
// USER APIs
// =============================================================================

export const getUserProfile = (userId) => {
  return apiClient.get(`/api/v1/users/${userId}`);
};

export const updateUserProfile = (userId, userData) => {
  return apiClient.put(`/api/v1/users/${userId}`, userData);
};

export const enableMFA = (userId) => {
  return apiClient.post(`/api/v1/users/${userId}/mfa/enable`);
};

export const verifyMFA = (userId, code) => {
  return apiClient.post(`/api/v1/users/${userId}/mfa/verify`, { code });
};

export default apiClient;
