import React from "react";

/**
 * Button Component — Earthy Premium UI
 * ------------------------------------
 * Variants:
 * - primary
 * - secondary
 * - outline
 * - danger
 */

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  iconLeft = null,
  iconRight = null,
}) {
  const bg = {
    primary: "var(--color-primary)",
    secondary: "var(--color-surface-alt)",
    outline: "transparent",
    danger: "var(--status-danger)",
  };

  const text = {
    primary: "var(--text-light)",
    secondary: "var(--text-primary)",
    outline: "var(--text-primary)",
    danger: "var(--text-light)",
  };

  const border = {
    primary: "var(--color-primary)",
    secondary: "var(--color-border)",
    outline: "var(--color-border)",
    danger: "var(--status-danger)",
  };

  const hoverBg = {
    primary: "var(--color-primary-dark)",
    secondary: "var(--color-surface-hover)",
    outline: "var(--color-surface-alt)",
    danger: "var(--status-danger-dark)",
  };

  return (
    <>
      <style>{`
        .earthy-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-md);
          border-width: 1px;
          border-style: solid;
          cursor: pointer;
          transition: all var(--transition-medium);
          box-shadow: var(--shadow-xs);
          user-select: none;
        }

        .earthy-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .earthy-btn:active {
          transform: translateY(0);
          box-shadow: var(--shadow-xs);
        }

        .earthy-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`earthy-btn ${className}`}
        style={{
          background: bg[variant],
          color: text[variant],
          borderColor: border[variant],
        }}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.background = hoverBg[variant];
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = bg[variant];
        }}
      >
        {/* Icon Left */}
        {iconLeft && (
          <span style={{ fontSize: "16px", display: "flex" }}>{iconLeft}</span>
        )}

        {/* Text / Loading */}
        {loading ? "Processing..." : children}

        {/* Icon Right */}
        {iconRight && (
          <span style={{ fontSize: "16px", display: "flex" }}>{iconRight}</span>
        )}
      </button>
    </>
  );
}
