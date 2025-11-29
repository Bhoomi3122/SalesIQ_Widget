import React from "react";

/**
 * LOADER COMPONENT
 * -------------------------------
 * Professional spinning loader state.
 * Matches 'variables.css' theme.
 */

export default function Loader({ text = "Loading...", size = 32, className = "" }) {
  return (
    <div className={`loader-container ${className}`}>
      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          color: var(--text-muted);
          gap: 12px;
          height: 100%;
          min-height: 120px;
        }

        .spinner {
          border-radius: 50%;
          border: 3px solid var(--border-color);
          border-top-color: var(--color-primary);
          animation: spin 0.8s linear infinite;
        }

        .loader-text {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.01em;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div 
        className="spinner"
        style={{
          width: size,
          height: size
        }}
      />
      
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
}