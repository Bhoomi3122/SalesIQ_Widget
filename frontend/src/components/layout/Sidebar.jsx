import React from "react";

/**
 * Sidebar Component
 * -----------------
 * Vertical navigation sidebar for operator dashboard.
 *
 * Props:
 * - items: [{ key, label, icon }]
 * - activeKey
 * - onSelect(key)
 */

export default function Sidebar({ items = [], activeKey, onSelect }) {
  return (
    <>
      <style>{`
        /* ---------------------------------------------------------
           SIDEBAR – EARTHY PREMIUM DESIGN
        ---------------------------------------------------------- */
        .sidebar-container {
          width: 72px;
          height: 100vh;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.96),
            rgba(247,244,240,0.92)
          );
          border-right: 1.5px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding-top: var(--space-3);
          gap: var(--space-1);
          box-shadow:
            3px 0 6px rgba(80,70,60,0.06),
            inset -1px 0 0 rgba(255,255,255,0.4);
          animation: sidebarSlideIn 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          transition: background var(--transition-medium);
        }

        .sidebar-container:hover {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.98),
            rgba(247,244,240,0.95)
          );
        }

        /* Glowing side edge */
        .sidebar-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 2px;
          height: 100%;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity var(--transition-medium);
        }

        .sidebar-container:hover::before {
          opacity: 0.3;
        }

        @keyframes sidebarSlideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* ---------------------------------------------------------
           ITEM STYLES
        ---------------------------------------------------------- */
        .sidebar-item {
          cursor: pointer;
          padding: var(--space-3) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 var(--space-2);
          border-radius: var(--radius-lg);
          position: relative;
          overflow: hidden;
          transition: all var(--transition-medium);
          animation: itemFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) backwards;
        }

        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity var(--transition-medium);
          border-radius: var(--radius-lg);
        }

        .sidebar-item > * {
          position: relative;
          z-index: 2;
        }

        /* Active item */
        .sidebar-item-active {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          box-shadow:
            0 3px 8px rgba(80,70,60,0.15),
            inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateX(2px);
        }

        .sidebar-item-active::before {
          opacity: 0.12;
        }

        /* Active left bar */
        .sidebar-active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--gradient-primary);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 8px rgba(182,141,115,0.5);
          animation: indicatorGrow 0.25s ease-out;
        }

        @keyframes indicatorGrow {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 3px; }
        }

        /* Inactive */
        .sidebar-item-inactive {
          color: var(--text-secondary);
        }

        .sidebar-item-inactive:hover {
          background: rgba(245,240,232,0.7);
          transform: translateX(4px);
          box-shadow: var(--shadow-xs);
          color: var(--text-primary);
        }

        .sidebar-item-inactive:active {
          transform: translateX(2px);
        }

        /* ICON */
        .sidebar-icon {
          font-size: 22px;
          margin-bottom: var(--space-1);
          transition: all var(--transition-medium);
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .sidebar-item-active .sidebar-icon {
          transform: scale(1.15);
          background: rgba(182,141,115,0.18);
          opacity: 1;
        }

        .sidebar-item-inactive .sidebar-icon {
          opacity: 0.65;
        }

        .sidebar-item:hover .sidebar-icon {
          transform: scale(1.12) rotate(3deg);
          opacity: 1;
        }

        /* LABEL */
        .sidebar-label {
          font-size: var(--font-xs);
          text-align: center;
          width: 100%;
          padding: 0 var(--space-1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.02em;
          transition: all var(--transition-medium);
        }

        .sidebar-item-active .sidebar-label {
          font-weight: var(--font-semibold);
          color: var(--color-primary-dark);
        }

        .sidebar-item-inactive .sidebar-label {
          font-weight: var(--font-medium);
        }

        /* ---------------------------------------------------------
           TOOLTIP ON HOVER
        ---------------------------------------------------------- */
        .sidebar-item::after {
          content: attr(data-label);
          position: absolute;
          left: 80px;
          background: var(--text-primary);
          color: var(--text-light);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          font-size: var(--font-xs);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-fast);
          box-shadow: var(--shadow-md);
        }

        .sidebar-item:hover::after {
          opacity: 0.95;
          transition-delay: 0.4s;
        }

        /* ---------------------------------------------------------
           SCROLLBAR
        ---------------------------------------------------------- */
        .sidebar-container::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: var(--radius-sm);
        }
        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-dark);
        }

        /* ---------------------------------------------------------
           RESPONSIVE
        ---------------------------------------------------------- */
        @media (max-width: 768px) {
          .sidebar-container { width: 64px; }
          .sidebar-icon {
            font-size: 20px;
            width: 28px;
            height: 28px;
          }
          .sidebar-label { font-size: 10px; }
        }

        @media (max-width: 480px) {
          .sidebar-container { width: 56px; }
          .sidebar-icon {
            font-size: 18px;
            width: 24px;
            height: 24px;
          }
          .sidebar-label { font-size: 9px; }
        }

        /* ---------------------------------------------------------
           ACCESSIBILITY
        ---------------------------------------------------------- */
        .sidebar-item:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Staggered animations */
        .sidebar-item:nth-child(1) { animation-delay: 0.05s; }
        .sidebar-item:nth-child(2) { animation-delay: 0.10s; }
        .sidebar-item:nth-child(3) { animation-delay: 0.15s; }
        .sidebar-item:nth-child(4) { animation-delay: 0.20s; }
        .sidebar-item:nth-child(5) { animation-delay: 0.25s; }
        .sidebar-item:nth-child(6) { animation-delay: 0.30s; }

      `}</style>

      <div className="sidebar-container">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <div
              key={item.key}
              className={`sidebar-item ${
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              }`}
              onClick={() => onSelect && onSelect(item.key)}
              data-label={item.label}
              tabIndex={0}
              aria-current={isActive ? "page" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect && onSelect(item.key);
                }
              }}
            >
              {isActive && <div className="sidebar-active-indicator" />}

              <div className="sidebar-icon">{item.icon}</div>

              <div className="sidebar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
