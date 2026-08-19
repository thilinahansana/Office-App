import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
});

// Token lives in memory (via this module-level variable) and localStorage,
// so a page refresh doesn't force a re-login.
let token = localStorage.getItem('office-app-token') || null;

export function setToken(newToken) {
  token = newToken;
  if (newToken) {
    localStorage.setItem('office-app-token', newToken);
  } else {
    localStorage.removeItem('office-app-token');
  }
}

export function getToken() {
  return token;
}

axiosClient.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
