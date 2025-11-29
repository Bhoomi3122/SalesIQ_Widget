import React from "react";
import { X } from "lucide-react"; // Ensure lucide-react is installed

/**
 * MODAL WRAPPER
 * ----------------------------------------------------
 * Generic container for overlays.
 * Matches 'variables.css' theme.
 */
export default function Modal({ 
  children, 
  isOpen, 
  onClose, 
  title,
  maxWidth = "500px" 
}) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-modal-overlay);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-container {
          background: var(--bg-surface);
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-modal);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        /* HEADER */
        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-body);
        }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          background: #e2e8f0;
          color: var(--text-main);
        }

        /* BODY */
        .modal-content {
          padding: 24px;
          overflow-y: auto;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="modal-container" 
          style={{ maxWidth: maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-content">
            {children}
          </div>

        </div>
      </div>
    </>
  );
}