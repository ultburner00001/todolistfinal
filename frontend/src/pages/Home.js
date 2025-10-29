import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoItem from "../components/TodoItem";

export default function Home({ token, setToken }) {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      await api.post("/todos", { text: task, dueDate });
      setTask("");
      setDueDate("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // 💳 Mock Payment Submit
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setShowPayment(false);
    alert("✅ Payment successful! You are now a Premium User!");
    setCardDetails({ name: "", cardNumber: "", expiry: "", cvv: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1100fff0, #ff0000ff)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ marginBottom: "10px", letterSpacing: "1px" }}>🎓 Taskify</h1>
      <p style={{ opacity: 0.8 }}>Stay organized and manage deadlines efficiently</p>

      {/* 🔹 Legend */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { color: "#ffb3b3", label: "Due in ≤3 days" },
          { color: "#ffd699", label: "Due in ≤7 days" },
          { color: "#ffff99", label: "Due in ≤10 days" },
          { color: "#b3ffb3", label: "Due in >10 days" },
        ].map((legend, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "6px 10px",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                background: legend.color,
                borderRadius: "4px",
                marginRight: "8px",
              }}
            ></div>
            <span style={{ fontSize: "0.9em" }}>{legend.label}</span>
          </div>
        ))}
      </div>

      {/* 🔹 Add Task */}
      <form
        onSubmit={addTodo}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            background: "rgba(255,255,255,0.9)",
          }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            background: "rgba(255,255,255,0.9)",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#ff7eb3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#ff4d97")}
          onMouseOut={(e) => (e.target.style.background = "#ff7eb3")}
        >
          ➕ Add
        </button>
      </form>

      {/* 🔹 Todo List */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {todos.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>No tasks yet 🎉</p>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} refresh={fetchTodos} api={api} />
          ))
        )}
      </div>

      {/* 💎 Upgrade to Premium */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={() => setShowPayment(true)}
          style={{
            background: "linear-gradient(90deg, #6C63FF, #8A2BE2)",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.3s ease",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.8")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          💎 Upgrade to Premium
        </button>
      </div>

      {/* 💳 Mock Payment Modal */}
      {showPayment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#333",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginBottom: 15, textAlign: "center" }}>
              💳 Enter Payment Details
            </h2>
            <form onSubmit={handlePaymentSubmit}>
              <input
                type="text"
                placeholder="Cardholder Name"
                required
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Card Number"
                required
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="password"
                  placeholder="CVV"
                  required
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button type="submit" style={submitBtn}>
                  Submit Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  style={cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Logout */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "35px" }}>
        <button
          onClick={logout}
          style={{
            background: "rgba(255,255,255,0.25)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "8px 18px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            letterSpacing: "0.5px",
            transition: "all 0.2s ease",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
};

const submitBtn = {
  background: "#6C63FF",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  marginRight: "10px",
};

const cancelBtn = {
  background: "#ddd",
  color: "#333",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};
