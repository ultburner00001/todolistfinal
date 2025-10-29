import React from "react";

export default function TodoItem({ todo, refresh, api }) {
  const toggleComplete = async () => {
    await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    refresh();
  };

  const deleteTodo = async () => {
    await api.delete(`/todos/${todo._id}`);
    refresh();
  };

  const getDueColor = (dueDate) => {
    if (!dueDate) return "#fff";
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return "#ffb3b3";
    if (diffDays <= 7) return "#ffd699";
    if (diffDays <= 10) return "#ffff99";
    return "#b3ffb3";
  };

  return (
    <div
      style={{
        background: todo.completed
          ? "linear-gradient(90deg, #00c6ff, #0072ff)"
          : getDueColor(todo.dueDate),
        borderRadius: "14px",
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <input type="checkbox" checked={todo.completed} onChange={toggleComplete} />
        <div style={{ marginLeft: "10px" }}>
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              fontWeight: "600",
              color: todo.completed ? "#222" : "#111",
              fontSize: "1.05rem",
            }}
          >
            {todo.text}
          </span>
          {todo.dueDate && (
            <div style={{ fontSize: "0.9rem", color: "#333" }}>
              📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={deleteTodo}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.4rem",
          color: "#ff1744",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        🗑
      </button>
    </div>
  );
}
