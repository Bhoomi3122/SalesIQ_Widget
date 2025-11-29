import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * MAIN LAYOUT
 * ----------------------------------------------------
 * A responsive 3-pane grid system.
 * Matches the 'Enterprise' theme structure.
 */
const Layout = ({ children, sidebarContent, rightPanelContent }) => {
  return (
    <div className="app-layout">
      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--bg-body);
          overflow: hidden;
        }

        .main-wrapper {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* 1. SIDEBAR (Left) */
        .layout-sidebar {
          width: var(--sidebar-width);
          background: var(--bg-sidebar); /* Dark Navy */
          color: var(--text-light);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-color);
          z-index: 30;
        }

        /* 2. CONTENT AREA (Center) */
        .layout-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* 3. RIGHT PANEL (AI/Context) */
        .layout-right-panel {
          width: 320px;
          background: var(--bg-surface);
          border-left: 1px solid var(--border-color);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* RESPONSIVE: Hide Right Panel on Tablets */
        @media (max-width: 1024px) {
          .layout-right-panel {
            display: none; /* Collapses for smaller screens */
          }
        }
        
        /* RESPONSIVE: Sidebar becomes drawer on Mobile */
        @media (max-width: 768px) {
          .layout-sidebar {
            display: none; 
          }
        }
      `}</style>

      {/* TOP BAR */}
      <Header />

      <div className="main-wrapper">
        
        {/* LEFT PANE: Navigation & Profile */}
        <aside className="layout-sidebar">
          <Sidebar>
            {sidebarContent}
          </Sidebar>
        </aside>

        {/* CENTER PANE: Main Dashboard */}
        <main className="layout-content">
          {children}
        </main>

        {/* RIGHT PANE: AI Intelligence */}
        <aside className="layout-right-panel">
          {rightPanelContent}
        </aside>

      </div>
    </div>
  );
};

export default Layout;