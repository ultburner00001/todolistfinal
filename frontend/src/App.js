import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { setAuthToken } from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    // Keep axios configured with token
    setAuthToken(token);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected home route */}
        <Route
          path="/"
          element={
            token ? (
              <Home token={token} onLogout={() => setToken(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login/Register */}
        <Route
          path="/login"
          element={<LoginRegister onLogin={(tkn) => setToken(tkn)} />}
        />

        {/* Stripe pages */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
