const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let authToken = localStorage.getItem("authToken");

    if (authToken) {
      if (!authToken.startsWith("Bearer ")) {
          authToken = `Bearer ${authToken}`;
      }
      config.headers.Authorization = authToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
