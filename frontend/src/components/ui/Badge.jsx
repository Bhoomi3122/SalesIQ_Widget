import React from "react";

/**
 * BADGE COMPONENT
 * -----------------------------------
 * Status indicators and labels.
 * * Props:
 * - variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'
 * - icon: Optional ReactNode (e.g., <Star size={10}/>)
 */

export default function Badge({ children, variant = "neutral", icon, className = "" }) {
  
  return (
    <>
      <style>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          font-size: 0.75rem; /* 12px */
          font-weight: 600;
          border-radius: 9999px; /* Pill shape */
          line-height: 1;
          white-space: nowrap;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          letter-spacing: 0.02em;
        }

        .badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* --- VARIANTS --- */
        
        /* Success (Green) - Delivered */
        .badge-success {
          background-color: #ecfdf5;
          color: var(--color-success);
          border-color: #a7f3d0;
        }

        /* Warning (Amber) - Pending/Unfulfilled */
        .badge-warning {
          background-color: #fffbeb;
          color: var(--color-warning);
          border-color: #fde68a;
        }

        /* Danger (Red) - Cancelled/Risk */
        .badge-danger {
          background-color: #fef2f2;
          color: var(--color-danger);
          border-color: #fecaca;
        }

        /* Info (Sky) - Tracking/Transit */
        .badge-info {
          background-color: #f0f9ff;
          color: var(--color-info);
          border-color: #bae6fd;
        }

        /* Primary (Blue) - Active/New */
        .badge-primary {
          background-color: #eff6ff;
          color: var(--color-primary);
          border-color: #bfdbfe;
        }

        /* Neutral (Slate) - Tags/Default */
        .badge-neutral {
          background-color: #f1f5f9;
          color: var(--text-muted);
          border-color: var(--border-color);
        }
      `}</style>

      <span className={`badge badge-${variant} ${className}`}>
        {icon && <span className="badge-icon">{icon}</span>}
        <span>{children}</span>
      </span>
    </>
  );
}