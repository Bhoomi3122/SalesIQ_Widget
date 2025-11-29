import React from "react";

/**
 * AppHeader — SalesIQ Copilot Branding
 * -------------------------------------
 * A premium top-bar header representing your product identity.
 *
 * Props:
 * - rightContent (optional JSX) → buttons / icons (settings, refresh, etc.)
 */

export default function Header({ rightContent }) {
  return (
    <>
      <style>{`
        /* ---------------------------------------------------------
           SALESIQ COPILOT — TOP APP HEADER (EARTHY PREMIUM)
        ---------------------------------------------------------- */

        .sq-header {
          width: 100%;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.96),
            rgba(247,244,240,0.92)
          );
          border-bottom: 1px solid var(--border-light);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
          box-shadow:
            0 3px 6px rgba(80,70,60,0.05),
            0 1px 2px rgba(80,70,60,0.03);
          animation: headerFade 0.35s ease-out;
        }

        @keyframes headerFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* LEFT BLOCK */
        .sq-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* APP ICON */
        .sq-header-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-dark);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.03em;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-primary);
        }

        /* TEXT BLOCK */
        .sq-header-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .sq-header-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: -2px;
          letter-spacing: 0;
        }

        /* RIGHT CONTENT */
        .sq-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* RESPONSIVE */
        @media (max-width: 600px) {
          .sq-header {
            padding: 10px 14px;
          }
          .sq-header-logo {
            width: 32px;
            height: 32px;
            font-size: 15px;
          }
          .sq-header-title {
            font-size: 15px;
          }
          .sq-header-subtitle {
            font-size: 11px;
          }
        }
      `}</style>

      <header className="sq-header">
        {/* LEFT: LOGO + TITLE */}
        <div className="sq-header-left">
          <div className="sq-header-logo">AI</div>

          <div>
            <div className="sq-header-title">SalesIQ Copilot</div>
            <div className="sq-header-subtitle">
              Your AI-powered ecommerce assistant
            </div>
          </div>
        </div>

        {/* RIGHT: ACTION BUTTONS */}
        {rightContent && <div className="sq-header-actions">{rightContent}</div>}
      </header>
    </>
  );
}
