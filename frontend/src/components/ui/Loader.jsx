import React from "react";

/**
 * Loader — Earthy Premium Spinner
 * -------------------------------
 * Props:
 * - text (string)
 * - size (number)
 * - className (string)
 */

export default function Loader({ text = "", size = 34, className = "" }) {
  return (
    <div
      className={`earthy-loader ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        gap: "10px",
        padding: "8px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid var(--border-light)",
          borderTopColor: "var(--color-primary)",
          animation: "earthySpin 0.8s linear infinite",
        }}
      ></div>

      {/* Optional Text */}
      {text && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: 500,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </p>
      )}

      {/* Spinner animation */}
      <style>{`
        @keyframes earthySpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
