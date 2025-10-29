import React, { useState, useEffect } from "react";
import LoginRegister from "./pages/LoginRegister";
import Home from "./pages/Home";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token ? <Home token={token} setToken={setToken} /> : <LoginRegister setToken={setToken} />;
}
