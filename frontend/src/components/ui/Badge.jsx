import React from "react";

/**
 * Badge Component — Earthy Premium UI
 * -----------------------------------
 * Variants:
 * - gray
 * - green
 * - yellow
 * - red
 * - blue
 */

export default function Badge({ children, variant = "gray", className = "" }) {
  const background = {
    gray: "var(--status-info-bg)",
    green: "var(--status-success-bg)",
    yellow: "var(--status-warning-bg)",
    red: "var(--status-danger-bg)",
    blue: "var(--status-info-bg)",
  };

  const text = {
    gray: "var(--text-secondary)",
    green: "var(--status-success)",
    yellow: "var(--status-warning)",
    red: "var(--status-danger)",
    blue: "var(--status-info)",
  };

  const border = {
    gray: "var(--status-info-border)",
    green: "var(--status-success-border)",
    yellow: "var(--status-warning-border)",
    red: "var(--status-danger-border)",
    blue: "var(--status-info-border)",
  };

  return (
    <>
      <style>{`
        .earthy-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          font-size: 11.5px;
          font-weight: 600;
          border-radius: 20px;
          letter-spacing: 0.01em;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-xs);
          border-width: 1px;
          border-style: solid;
        }

        .earthy-badge:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>

      <span
        className={`earthy-badge ${className}`}
        style={{
          background: background[variant],
          color: text[variant],
          borderColor: border[variant],
        }}
      >
        {children}
      </span>
    </>
  );
}
