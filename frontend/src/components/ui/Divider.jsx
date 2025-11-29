import React from "react";

/**
 * Divider Component — Earthy Premium UI
 * -------------------------------------
 * Replaces Tailwind + clsx divider.
 *
 * Props:
 * - spacing: optional vertical spacing (default medium)
 * - className: extra classes if needed
 */

export default function Divider({ spacing = "var(--space-3)", className = "" }) {
  return (
    <>
      <style>{`
        .earthy-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(150,140,130,0.32) 20%,
            rgba(150,140,130,0.32) 80%,
            transparent
          );
          opacity: 0.75;
          width: 100%;
        }
      `}</style>

      <div
        className="earthy-divider"
        style={{ margin: `${spacing} 0` }}
      ></div>
    </>
  );
}
