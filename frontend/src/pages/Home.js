import React, { useEffect, useState } from "react";
import axiosInstance, { setAuthToken } from "../api";
import TodoItem from "../components/TodoItem";
import { useNavigate } from "react-router-dom";

/* ---------------------- PAYMENT POPUP COMPONENT ---------------------- */
function PaymentPopup({
  paymentMethod,
  setPaymentMethod,
  card,
  setCard,
  upiId,
  setUpiId,
  paymentMsg,
  paymentLoading,
  handleCardChange,
  handlePaymentSubmit,
  setShowPaymentPopup,
}) {
  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.card}>
        <div style={popupStyles.header}>
          <h3 style={{ margin: 0 }}>💳 Upgrade to Premium</h3>
          <button
            style={popupStyles.closeBtn}
            onClick={() => setShowPaymentPopup(false)}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 12 }}>
          Unlock premium features for just ₹99
        </p>

        <div style={popupStyles.methodRow}>
          {["card", "upi"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              style={{
                ...popupStyles.methodBtn,
                background:
                  paymentMethod === method
                    ? "rgba(75,124,255,0.25)"
                    : "transparent",
                borderColor:
                  paymentMethod === method
                    ? "#4B7CFF"
                    : "rgba(255,255,255,0.15)",
              }}
            >
              {method === "card" ? "💳 Card" : "📱 UPI"}
            </button>
          ))}
        </div>

        {paymentMethod === "card" ? (
          <>
            <input
              style={popupStyles.input}
              placeholder="Card Number"
              value={card.number}
              onChange={(e) => handleCardChange("number", e.target.value)}
            />
            <input
              style={popupStyles.input}
              placeholder="Cardholder Name"
              value={card.name}
              onChange={(e) => handleCardChange("name", e.target.value)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...popupStyles.input, flex: 1 }}
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => handleCardChange("expiry", e.target.value)}
                maxLength={5}
              />
              <input
                style={{ ...popupStyles.input, width: 90 }}
                placeholder="CVV"
                value={card.cvv}
                onChange={(e) => handleCardChange("cvv", e.target.value)}
                maxLength={4}
              />
            </div>
          </>
        ) : (
          <input
            style={popupStyles.input}
            placeholder="UPI ID (e.g. name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        )}

        {paymentMsg && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background:
                paymentMsg.type === "success"
                  ? "rgba(72,187,120,0.15)"
                  : "rgba(255,99,99,0.15)",
              color: paymentMsg.type === "success" ? "#48bb78" : "#ff6b6b",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {paymentMsg.text}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={handlePaymentSubmit}
            disabled={paymentLoading}
            style={popupStyles.payBtn}
          >
            {paymentLoading ? "Processing..." : "Pay ₹99"}
          </button>
          <button
            onClick={() => setShowPaymentPopup(false)}
            style={popupStyles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- MAIN HOME PAGE --------------------------- */
export default function Home({ token, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [paymentMsg, setPaymentMsg] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);
    fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get("/api/todos");
      setTodos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch todos error:", err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim() || !dueDate) return alert("Enter task and due date.");
    try {
      const res = await axiosInstance.post("/api/todos", { text, dueDate });
      setTodos((prev) => [...prev, res.data]);
      setText("");
      setDueDate("");
    } catch {
      alert("Failed to add todo");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axiosInstance.put(`/api/todos/${id}`, { completed });
      setTodos((p) => p.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/api/todos/${id}`);
      setTodos((p) => p.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthToken(null);
    onLogout();
    navigate("/login");
  };

  /* -------------- FAKE PAYMENT LOGIC (Frontend Only) -------------- */
  const handleCardChange = (field, value) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentSubmit = () => {
    setPaymentLoading(true);
    setPaymentMsg(null);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentMsg({
        type: "success",
        text: "✅ Payment Successful! Premium activated.",
      });
      setTimeout(() => setShowPaymentPopup(false), 1500);
    }, 1500);
  };

  /* -------------- COLOR + DAYS LEFT FOR TODO -------------- */
  const getTodoStyles = (dueDate) => {
    if (!dueDate)
      return { background: "rgba(76, 175, 80, 0.3)", color: "#fff", daysLeft: null };

    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    let color = "#4caf50"; // green
    if (diffDays <= 0) color = "#ff4c4c"; // red
    else if (diffDays <= 5) color = "#ffae42"; // orange
    else if (diffDays <= 10) color = "#f7f75a"; // yellow

    return {
      background: `${color}40`, // add transparency
      color: "#fff",
      daysLeft: diffDays,
    };
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Taskify — Welcome {localStorage.getItem("username") || ""}</h2>
        <div style={styles.headerButtons}>
          <button onClick={() => setShowPaymentPopup(true)} style={styles.upgradeBtn}>
            💎 Upgrade
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
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.dateInput}
          />
          <button type="submit" style={styles.addBtn}>
            Add
          </button>
        </form>

        <div style={{ marginTop: 16 }}>
          {todos.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No tasks yet</p>
          ) : (
            todos.map((todo) => {
              const { background, daysLeft } = getTodoStyles(todo.dueDate);
              return (
                <div
                  key={todo._id}
                  style={{
                    background,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    transition: "background 0.5s ease",
                  }}
                >
                  <TodoItem
                    todo={{
                      ...todo,
                      daysLeft,
                    }}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                  {todo.dueDate && (
                    <p
                      style={{
                        fontSize: 13,
                        opacity: 0.9,
                        marginTop: 4,
                        textAlign: "right",
                      }}
                    >
                      ⏰{" "}
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
                        : "Overdue!"}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {showPaymentPopup && (
        <PaymentPopup
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          card={card}
          setCard={setCard}
          upiId={upiId}
          setUpiId={setUpiId}
          paymentMsg={paymentMsg}
          paymentLoading={paymentLoading}
          handleCardChange={handleCardChange}
          handlePaymentSubmit={handlePaymentSubmit}
          setShowPaymentPopup={setShowPaymentPopup}
        />
      )}
    </div>
  );
}

/* --------------------------- STYLES --------------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(#001868fb, #07071fff)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    padding: 24,
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerButtons: { display: "flex", gap: 10 },
  upgradeBtn: {
    background: "linear-gradient(90deg,#6C63FF,#8A2BE2)",
    border: "none",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  logout: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  container: { maxWidth: 700, margin: "28px auto" },
  form: { display: "flex", gap: 8 },
  input: { flex: 1, padding: 10, borderRadius: 8, border: "none" },
  dateInput: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#ffffffff",
    color: "#000000ff",
  },
  addBtn: {
    padding: "10px 14px",
    background: "#4B7CFF",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
};

/* --------------------------- POPUP STYLES --------------------------- */
const popupStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  card: {
    width: 360,
    background: "rgba(30,30,50,0.96)",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
  },
  methodRow: { display: "flex", gap: 8, margin: "12px 0" },
  methodBtn: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    marginBottom: 8,
  },
  payBtn: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#4B7CFF,#8A2BE2)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "#ccc",
    cursor: "pointer",
  },
};
