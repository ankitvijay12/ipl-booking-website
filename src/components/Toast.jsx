import React from "react";
import "./Toast.css"; // Optional: if you want styling, or use inline styles

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <span>{message}</span>
    </div>
  );
}
