import React from "react";

/**
 * ReplySuggestion
 * ----------------
 * Compact AI-generated reply suggestion card.
 *
 * Props:
 * - text (string)
 * - onSelect()
 */

export default function ReplySuggestion({ text, onSelect }) {
  if (!text) return null;

  return (
    <>
      <style>{`
        .reply-suggestion-card {
          padding: 10px 12px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          background: var(--color-surface);
          font-size: 13px;
          line-height: 18px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-xs);
        }

        .reply-suggestion-card:hover {
          background: var(--surface-hover);
          border-color: var(--color-primary);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .reply-suggestion-card:active {
          transform: translateY(0);
          box-shadow: var(--shadow-xs);
        }
      `}</style>

      <div className="reply-suggestion-card" onClick={onSelect}>
        {text}
      </div>
    </>
  );
}
