import React from "react";
import Button from "./Button";

/**
 * ErrorBlock — Earthy Premium UI
 * -------------------------------
 * Props:
 * - message: string
 * - onRetry: function
 * - className: external classes (optional)
 */

export default function ErrorBlock({
  message = "Something went wrong.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`error-block ${className}`}
      style={{
        padding: "12px 14px",
        borderRadius: "8px",
        background: "var(--status-danger-bg)",
        color: "var(--status-danger)",
        border: "1px solid var(--status-danger-border)",
        fontSize: "14px",
        lineHeight: "20px",
        boxShadow: "var(--shadow-xs)",
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: onRetry ? "10px" : "0px",
          letterSpacing: "-0.01em",
        }}
      >
        {message}
      </div>

      {onRetry && (
        <Button
          variant="danger"
          onClick={onRetry}
          className="error-retry-btn"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
