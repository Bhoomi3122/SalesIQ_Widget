import React from "react";
import { LayoutDashboard, ShoppingBag, BarChart2, Settings, LogOut } from "lucide-react"; // Install lucide-react

/**
 * SIDEBAR NAVIGATION
 * -------------------------------------
 * Vertical navigation rail.
 * Matches 'variables.css' theme (Dark Navy Background).
 */

export default function Sidebar({ activeView, onViewChange }) {
  
  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <style>{`
        /* SIDEBAR CONTAINER */
        .app-sidebar {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 12px;
          gap: 8px;
        }

        /* NAV ITEMS */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-muted); /* Muted text on dark bg */
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }

        /* HOVER STATE */
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        /* ACTIVE STATE */
        .nav-item.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); /* Blue glow */
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* BOTTOM SECTION */
        .sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          color: var(--color-danger);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }
      `}</style>

      <nav className="app-sidebar">
        {/* MAIN NAVIGATION */}
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        {/* FOOTER ACTIONS */}
        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}