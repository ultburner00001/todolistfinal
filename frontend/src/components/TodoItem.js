import React, { useEffect, useState } from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  const [color, setColor] = useState("#00b894"); // default green

  // ✅ Compute dynamic background color
  const computeColor = () => {
    const today = new Date();
    const dueDate = new Date(todo.dueDate || todo.date);
    if (isNaN(dueDate)) return "#2ecc71"; // fallback

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "#ff4d4d"; // 🔴 today or overdue
    if (diffDays <= 5) {
      // 🟧 Orange gradient (0–5 days)
      const ratio = diffDays / 5;
      const r = 255;
      const g = 100 + ratio * 100; // 200 → 100
      const b = 50 * ratio;
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (diffDays <= 10) {
      // 🟨 Yellow gradient (6–10 days)
      const ratio = (diffDays - 5) / 5;
      const r = 255;
      const g = 220 + ratio * 20; // slight fade
      const b = 60;
      return `rgb(${r}, ${g}, ${b})`;
    }
    // 🟩 Green for >10 days
    const ratio = Math.min(diffDays / 20, 1);
    const g = 150 + ratio * 100;
    return `rgb(0, ${g}, 100)`;
  };

  // ✅ Calculate days left
  const getDaysLeft = () => {
    const today = new Date();
    const dueDate = new Date(todo.dueDate || todo.date);
    if (isNaN(dueDate)) return "";
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Due today!";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  // ⏱ Auto update color every minute
  useEffect(() => {
    setColor(computeColor());
    const interval = setInterval(() => {
      setColor(computeColor());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [todo.dueDate, todo.date]);

  return (
    <div
      style={{
        ...itemStyle.container,
        background: color,
        transition: "background 0.8s ease",
      }}
    >
      <div style={itemStyle.left}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
          style={itemStyle.checkbox}
        />

        <div>
          <div
            style={{
              ...itemStyle.text,
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.text}
          </div>

          {(todo.dueDate || todo.date) && (
            <div style={itemStyle.date}>
              📅 {new Date(todo.dueDate || todo.date).toLocaleDateString()} —{" "}
              <span style={{ fontWeight: "bold" }}>{getDaysLeft()}</span>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => onDelete(todo._id)} style={itemStyle.delete}>
        Delete
      </button>
    </div>
  );
}

// 💅 Styles
const itemStyle = {
  container: {
    padding: "12px 16px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    marginBottom: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  checkbox: {
    width: 18,
    height: 18,
    cursor: "pointer",
    accentColor: "#fff",
  },
  text: {
    fontWeight: 500,
    fontSize: 16,
  },
  date: {
    fontSize: 13,
    opacity: 0.9,
  },
  delete: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    padding: "6px 12px",
    transition: "all 0.2s ease",
  },
};
