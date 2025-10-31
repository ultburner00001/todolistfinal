// src/components/TodoItem.js
import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div style={itemStyle.container}>
      <div>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
        />{" "}
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.text}
        </span>
      </div>
      <div>
        <button onClick={() => onDelete(todo._id)} style={itemStyle.delete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const itemStyle = {
  container: {
    background: "rgba(255,255,255,0.06)",
    padding: "10px 12px",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  delete: {
    background: "transparent",
    color: "#ff6b6b",
    border: "none",
    cursor: "pointer",
  },
};
