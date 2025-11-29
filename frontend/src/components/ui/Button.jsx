import React from "react";
import { Loader2 } from "lucide-react"; // Ensure lucide-react is installed

/**
 * BUTTON COMPONENT
 * ------------------------------------
 * Variants: 'primary', 'secondary', 'outline', 'danger', 'ghost'
 * Sizes: 'sm', 'md', 'lg'
 */

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  iconLeft = null,
  iconRight = null,
  title = "",
}) {
  
  return (
    <>
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          white-space: nowrap;
          font-family: inherit;
          user-select: none;
        }

        .btn:disabled, .btn.loading {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* --- VARIANTS --- */
        
        /* Primary (Blue) */
        .btn-primary {
          background-color: var(--color-primary);
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }
        .btn-primary:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-1px);
        }

        /* Secondary (White) */
        .btn-secondary {
          background-color: #ffffff;
          color: var(--text-main);
          border-color: var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .btn-secondary:hover {
          background-color: var(--bg-body);
          border-color: #cbd5e1;
        }

        /* Outline (Transparent with Border) */
        .btn-outline {
          background-color: transparent;
          color: var(--text-main);
          border-color: var(--border-color);
        }
        .btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.5);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        /* Danger (Red) */
        .btn-danger {
          background-color: var(--color-danger);
          color: #ffffff;
        }
        .btn-danger:hover {
          background-color: #dc2626;
        }
        
        /* Ghost (Text Only) */
        .btn-ghost {
          background-color: transparent;
          color: var(--text-muted);
        }
        .btn-ghost:hover {
          background-color: rgba(0,0,0,0.05);
          color: var(--text-main);
        }

        /* --- SIZES --- */
        .btn-sm {
          padding: 6px 12px;
          font-size: 0.85rem;
          height: 32px;
        }
        .btn-md {
          padding: 10px 16px;
          font-size: 0.95rem;
          height: 40px;
        }
        .btn-lg {
          padding: 12px 24px;
          font-size: 1rem;
          height: 48px;
        }

        /* Loading Spinner */
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        title={title}
        className={`btn btn-${variant} btn-${size} ${loading ? "loading" : ""} ${className}`}
      >
        {loading ? (
          <Loader2 size={16} className="spinner" />
        ) : (
          <>
            {iconLeft && <span className="btn-icon">{iconLeft}</span>}
            {children}
            {iconRight && <span className="btn-icon">{iconRight}</span>}
          </>
        )}
      </button>
    </>
  );
}