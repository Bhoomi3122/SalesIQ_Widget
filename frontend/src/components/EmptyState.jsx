import React from "react";

/**
 * EmptyState Component — Earthy Premium UI
 * ----------------------------------------
 * Shows a clean placeholder UI when there is no data.
 *
 * Props:
 * - title (string)
 * - subtitle (string)
 * - icon (optional JSX element)
 */

export default function EmptyState({ title, subtitle, icon }) {
  return (
    <div
      className="empty-state fade-in"
      style={{
        padding: "20px 18px",
        textAlign: "center",
        color: "var(--text-muted)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Optional Icon */}
      {icon && (
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "var(--color-surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary-dark)",
            fontSize: "22px",
            boxShadow: "var(--shadow-xs)",
            marginBottom: "4px",
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--text-main)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            maxWidth: "280px",
            margin: "0 auto",
            lineHeight: "1.45",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
