import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Post API
export const getPosts = (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({ page, limit, ...filters });
  return api.get(`/posts?${params}`);
};

export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (formData) => api.post("/posts", formData);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const commentOnPost = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const savePost = (id) => api.post(`/posts/${id}/save`);

// Auth API
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

// Payment API
export const createCheckoutSession = (data) => api.post("/payment/create-checkout-session", data);
export const getOrders = () => api.get("/payment/orders");
export const cancelOrder = (orderId, reason) => api.post(`/payment/orders/${orderId}/cancel`, { reason });

export default api;
