// src/api.js
import axios from "axios";

/* 🌍 MULTI-ENVIRONMENT CONFIGURATION
   --------------------------------------
   You can add multiple base URLs here.
   Simply change ACTIVE_ENV to switch environments.
*/
const ENV_LINKS = {
  local: "http://localhost:5000",
  render: "https://todo-51ze.onrender.com",
  vercel: "https://todolist-git-main-mehul-swamis-projects.vercel.app/api",
};

// 👇 Choose which one to use
const ACTIVE_ENV = "local"; // "local" | "render" | "vercel"

// ✅ Pick base URL safely
let BASE_URL = "http://localhost:5000"; // default fallback
try {
  const envURL = process?.env?.REACT_APP_API_URL;
  BASE_URL = envURL || ENV_LINKS[ACTIVE_ENV] || BASE_URL;
} catch (err) {
  console.warn("⚠️ Failed to read environment, using default localhost.");
}

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Token helper
export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

console.log(`🔗 Backend URL in use: ${BASE_URL}`);

export default axiosInstance;
