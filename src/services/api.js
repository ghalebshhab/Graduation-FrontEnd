import axios from "axios";

export const api = axios.create({
  baseURL: "",
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
