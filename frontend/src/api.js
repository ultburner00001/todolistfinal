// src/api.js
import axios from "axios";

/* 🌍 MULTI-ENVIRONMENT CONFIGURATION
   --------------------------------------
   Easily switch between environments by editing ACTIVE_ENV.
*/
const ENV_LINKS = {
  local: "http://localhost:5000",
  render: "https://todolistfinal-6ou5.onrender.com",
  vercel: "https://todolistfinal1-git-main-ultburners-projects.vercel.app",
};

// 👇 Choose which environment to use
const ACTIVE_ENV = "vercel"; // change to "render" or "vercel" when deployed

// ✅ Pick base URL safely
let BASE_URL = ENV_LINKS[ACTIVE_ENV];

// ✅ Allow .env variable override (CRA uses REACT_APP_ prefix)
if (process.env.REACT_APP_API_URL) {
  BASE_URL = process.env.REACT_APP_API_URL;
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
