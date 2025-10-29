import React, { useState } from "react";
import axios from "axios";

export default function LoginRegister({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const API = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/users/login" : "/users/register";
      const res = await axios.post(`${API}${endpoint}`, { username, password });
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      } else {
        alert("🎉 Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "⚠️ Something went wrong!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1100fff0, #ff0000ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px 50px",
          width: "350px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px", fontSize: "2rem", letterSpacing: "1px" }}>
           Taskify
        </h1>
        <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "25px" }}>
          {isLogin ? "Welcome back, champ!" : "Let’s get you started "}
        </p>

        <h2 style={{ marginBottom: "20px" }}>
          {isLogin ? "Login to Continue" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="👤 Username"
            required
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "1rem",
            }}
          />

          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="🔒 Password"
              required
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.1rem",
                opacity: 0.8,
              }}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            style={{
              background: "#ff9f43",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#ff7849")}
            onMouseOut={(e) => (e.target.style.background = "#ff9f43")}
          >
            {isLogin ? "Login 🚀" : "Register 📝"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            cursor: "pointer",
            color: "#fff",
            marginTop: "20px",
            textDecoration: "underline",
            fontSize: "0.9rem",
          }}
        >
          {isLogin
            ? "Don’t have an account? Create one!"
            : "Already registered? Log in!"}
        </p>

        <p style={{ fontSize: "0.8rem", marginTop: "20px", opacity: 0.8 }}>
          💡 Stay organized. Stay ahead.
        </p>
      </div>
    </div>
  );
}
