// src/api.js
import axios from "axios";

/* 🌍 MULTI-ENVIRONMENT CONFIGURATION */
const ENV_LINKS = {
  local: "http://localhost:5000",
  render: "https://todolistfinal-6ou5.onrender.com",
  vercel: "https://todolistfinal1-git-main-ultburners-projects.vercel.app",
};

// 👇 Choose which environment to use
const ACTIVE_ENV = "render"; // change to "vercel" when needed

// ✅ Pick base URL safely
let BASE_URL = ENV_LINKS[ACTIVE_ENV];
if (process.env.REACT_APP_API_URL) {
  BASE_URL = process.env.REACT_APP_API_URL;
}

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ✅ Automatically attach token to every request */
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get saved JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ✅ Helper to manually set or clear token (optional use) */
export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

console.log(`🔗 Backend URL in use: ${BASE_URL}`);

export default axiosInstance;
