import React from "react";
import { Sparkles, Bell, UserCircle } from "lucide-react"; // Ensure lucide-react is installed

/**
 * APP HEADER
 * -------------------------------------
 * The top navigation bar. Contains branding and operator status.
 * Matches 'variables.css' theme (Enterprise Blue/Slate).
 */

export default function Header({ rightContent }) {
  return (
    <>
      <style>{`
        /* HEADER CONTAINER */
        .app-header {
          width: 100%;
          height: var(--header-height);
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: var(--shadow-sm);
        }

        /* LEFT: BRANDING */
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: var(--color-primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }

        .brand-text h1 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          line-height: 1.2;
        }

        .brand-text p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* RIGHT: ACTIONS */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: var(--bg-body);
          color: var(--color-primary);
        }

        .operator-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 16px;
          border-left: 1px solid var(--border-color);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--color-success);
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .operator-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
        }
      `}</style>

      <header className="app-header">
        {/* LEFT: BRANDING */}
        <div className="header-brand">
          <div className="brand-icon">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <div className="brand-text">
            <h1>OmniCom Copilot</h1>
            <p>AI Command Center</p>
          </div>
        </div>

        {/* RIGHT: ACTIONS & PROFILE */}
        <div className="header-actions">
          {rightContent}
          
          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
          </button>

          <div className="operator-status">
            <div className="status-dot" title="Online"></div>
            <span className="operator-name">Operator</span>
            <UserCircle size={24} className="text-muted" />
          </div>
        </div>
      </header>
    </>
  );
}