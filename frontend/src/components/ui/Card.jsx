import React from "react";

/**
 * Card Component — Earthy Premium UI
 * ----------------------------------
 * Replaces all Tailwind + clsx versions.
 *
 * Props:
 * - title
 * - children
 * - className (optional)
 */

export default function Card({ title, children, className = "" }) {
  return (
    <>
      <style>{`
        .earthy-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-medium);
          animation: fadeIn 0.3s ease-out;
        }

        .earthy-card:hover {
          box-shadow: var(--shadow-sm);
          transform: translateY(-2px);
        }

        .earthy-card-title {
          font-size: var(--font-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-3);
          letter-spacing: -0.01em;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .earthy-card {
            padding: var(--space-4);
          }
        }
      `}</style>

      <div className={`earthy-card ${className}`}>
        {title && <h2 className="earthy-card-title">{title}</h2>}
        {children}
      </div>
    </>
  );
}
