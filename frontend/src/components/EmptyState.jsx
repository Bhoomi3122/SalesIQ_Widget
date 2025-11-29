import React from "react";
import { Inbox } from "lucide-react"; // Default icon

/**
 * EMPTY STATE COMPONENT
 * ----------------------------------------
 * Shows a clean placeholder UI when there is no data.
 * Matches 'variables.css' theme.
 */

export default function EmptyState({ 
  title = "No Data Found", 
  subtitle = "There is nothing to display here yet.", 
  icon 
}) {
  return (
    <div className="empty-state fade-in">
      <style>{`
        .empty-state {
          padding: 40px 24px;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-color);
          height: 100%;
          min-height: 200px;
        }

        .empty-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-body);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin-bottom: 16px;
          box-shadow: var(--shadow-sm);
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .empty-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          max-width: 300px;
          line-height: 1.5;
          margin: 0 auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Icon Circle */}
      <div className="empty-icon-wrapper">
        {icon || <Inbox size={24} />}
      </div>

      {/* Content */}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-subtitle">{subtitle}</p>
    </div>
  );
}