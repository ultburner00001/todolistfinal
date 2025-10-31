// src/pages/LoginRegister.js
import React, { useState } from "react";
import axiosInstance, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Ensure correct API route
      const path = isLogin ? "/api/users/login" : "/api/users/register";
      const url = `${axiosInstance.defaults.baseURL}${path}`;

      console.log("📡 Sending request to:", url);

      const res = await axiosInstance.post(path, { username, password });

      if (isLogin) {
        const { token, username: resUsername } = res.data || {};

        if (!token) throw new Error("No token received from server");

        // ✅ Save user session
        localStorage.setItem("token", token);
        localStorage.setItem("username", resUsername || username);

        // ✅ Set global Authorization header
        setAuthToken(token);

        // ✅ Notify parent (App.js)
        onLogin(token);

        // ✅ Redirect to home
        navigate("/");
      } else {
        alert("✅ Registration successful — please log in now.");
        setIsLogin(true);
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.error("❌ Login/Register error:", err);

      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        (err.message.includes("Network Error")
          ? "Backend server is offline. Please start it with: npm start"
          : err.message);

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={{ marginTop: 12 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "#e5ff00ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: 24,
    borderRadius: 10,
    width: 360,
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    background: "#00ff4cff",
    color: "#fff",
    fontWeight: 600,
    transition: "0.2s",
  },
};
