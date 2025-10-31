import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  if (!todo.dueDate) todo.dueDate = new Date().toISOString();

  // ✅ Calculate remaining days
  const today = new Date();
  const dueDate = new Date(todo.dueDate);
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  // ✅ Determine color
  let bgColor = "#00b894"; // green >10 days
  if (diffDays <= 0) bgColor = "#ff4d4d"; // red = due or past
  else if (diffDays <= 5) bgColor = "#ff9933"; // orange = within 5 days
  else if (diffDays <= 10) bgColor = "#ffd633"; // yellow = within 10 days

  return (
    <div
      style={{
        ...styles.container,
        background: bgColor,
      }}
    >
      <div style={styles.left}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
        />
        <span
          style={{
            ...styles.text,
            textDecoration: todo.completed ? "line-through" : "none",
          }}
        >
          {todo.text}
        </span>
      </div>

      <div style={styles.right}>
        <span style={styles.date}>
          📅 {new Date(todo.dueDate).toLocaleDateString()}{" "}
          ({diffDays > 0 ? `${diffDays} days left` : "Due today or past"})
        </span>
        <button onClick={() => onDelete(todo._id)} style={styles.delete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "12px 14px",
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    transition: "background 0.3s ease",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontWeight: 500,
    fontSize: 16,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  date: {
    fontSize: 14,
    opacity: 0.9,
  },
  delete: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 6,
    cursor: "pointer",
    padding: "4px 8px",
  },
};
