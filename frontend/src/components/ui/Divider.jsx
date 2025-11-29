import React from "react";

/**
 * DIVIDER COMPONENT
 * -------------------------------------
 * Simple horizontal line for separation.
 * Matches 'variables.css' theme.
 */

export default function Divider({ className = "" }) {
  return (
    <>
      <style>{`
        .divider {
          height: 1px;
          background-color: var(--border-color);
          width: 100%;
          margin: 0;
          opacity: 0.6;
        }
      `}</style>

      <div className={`divider ${className}`} />
    </>
  );
}