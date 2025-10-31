import React, { useEffect, useState } from "react";
import axiosInstance, { setAuthToken } from "../api";
import TodoItem from "../components/TodoItem";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

export default function Home({ token, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);
    fetchTodos();
    // eslint-disable-next-line
  }, [token]);

  // Fetch user's todos
  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get("/api/todos");
      setTodos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axiosInstance.post("/api/todos", { text });
      setTodos((p) => [...p, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to add todo");
    }
  };

  // Toggle completed
  const toggleTodo = async (id, completed) => {
    try {
      const res = await axiosInstance.put(`/api/todos/${id}`, { completed });
      setTodos((p) => p.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/api/todos/${id}`);
      setTodos((p) => p.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthToken(null);
    onLogout();
    navigate("/login");
  };

  // 🔹 Handle Stripe payment
  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const userToken = localStorage.getItem("token");
      if (!userToken) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }

      // Decode userId from JWT token
      const payload = JSON.parse(atob(userToken.split(".")[1]));
      const userId = payload.id;

      const res = await axiosInstance.post("/api/payment/create-checkout-session", {
        userId,
      });

      const stripe = await stripePromise;
      window.location.href = res.data.url; // redirect to Stripe Checkout
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Taskify — Welcome {localStorage.getItem("username") || ""}</h2>
        <div style={styles.headerButtons}>
          <button onClick={handleUpgrade} style={styles.upgradeBtn} disabled={isLoading}>
            {isLoading ? "Processing..." : "💎 Upgrade to Premium"}
          </button>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        <form onSubmit={addTodo} style={styles.form}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            style={styles.input}
          />
          <button type="submit" style={styles.addBtn}>
            Add
          </button>
        </form>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {todos.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No tasks yet</p>
          ) : (
            todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    fontFamily: "'Poppins', sans-serif",
    background: "#0b1020",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
  },
  logout: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  upgradeBtn: {
    background: "linear-gradient(90deg, #6C63FF, #8A2BE2)",
    border: "none",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
  container: { maxWidth: 720, margin: "28px auto" },
  form: { display: "flex", gap: 8 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    outline: "none",
  },
  addBtn: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#4B7CFF",
    color: "#fff",
    cursor: "pointer",
  },
};
