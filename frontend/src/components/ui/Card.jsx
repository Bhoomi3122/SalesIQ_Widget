import React from "react";

/**
 * CARD COMPONENT
 * ----------------------------------
 * Standard container with consistent padding and shadows.
 * Matches 'variables.css' theme.
 */

export default function Card({ title, children, className = "", onClick }) {
  return (
    <>
      <style>{`
        .card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          overflow: hidden;
        }

        .card.interactive:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
          cursor: pointer;
          border-color: var(--color-primary);
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        
        /* Responsive padding */
        @media (max-width: 640px) {
          .card {
            padding: 16px;
          }
        }
      `}</style>

      <div 
        className={`card ${onClick ? 'interactive' : ''} ${className}`}
        onClick={onClick}
      >
        {title && <h2 className="card-title">{title}</h2>}
        {children}
      </div>
    </>
  );
}