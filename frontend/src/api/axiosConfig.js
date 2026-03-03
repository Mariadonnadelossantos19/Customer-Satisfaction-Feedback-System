import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("adminToken")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export const getAuthToken = () => localStorage.getItem("adminToken");
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("isAdmin", "true");
  }
};
export const clearAuth = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("isAdmin");
};
