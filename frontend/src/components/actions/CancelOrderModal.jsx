import React, { useState } from "react";
import { X } from "lucide-react"; // Ensure you have lucide-react installed

/**
 * CANCEL ORDER MODAL
 * ----------------------------------------------------
 * A professional modal to capture cancellation reasons.
 * matches 'variables.css' theme.
 */
export default function CancelOrderModal({
  visible,
  order,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  if (!visible || !order) return null;

  const handleSubmit = () => {
    // Basic validation
    if (!reason.trim()) return; 
    onConfirm(reason);
    setReason("");
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-modal-overlay); /* Defined in variables.css */
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
          max-width: 420px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-modal);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* HEADER */
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-body);
        }

        .modal-title {
          font-size: 1.125rem; /* 18px */
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
        }
        .close-btn:hover {
          background: #e2e8f0;
          color: var(--text-main);
        }

        /* BODY */
        .modal-body {
          padding: 24px;
        }

        .modal-description {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .order-highlight {
          font-weight: 600;
          color: var(--text-main);
        }

        /* INPUT */
        .input-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .modal-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          color: var(--text-main);
          background: #fff;
          min-height: 100px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        .modal-textarea:focus {
          border-color: var(--color-danger); /* Red focus for destructive action */
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        /* FOOTER */
        .modal-footer {
          padding: 16px 24px;
          background: var(--bg-body);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* BUTTONS */
        .btn {
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .btn-cancel {
          background: white;
          border-color: var(--border-color);
          color: var(--text-main);
        }
        .btn-cancel:hover {
          background: #f1f5f9;
        }

        .btn-confirm {
          background: var(--color-danger);
          color: white;
          box-shadow: var(--shadow-sm);
        }
        .btn-confirm:hover {
          background: #dc2626;
        }
        .btn-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">Cancel Order</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p className="modal-description">
              Are you sure you want to cancel order <span className="order-highlight">{order.name}</span>? 
              This action cannot be undone.
            </p>

            <label className="input-label">
              Cancellation Reason <span style={{color: 'var(--color-danger)'}}>*</span>
            </label>
            <textarea
              className="modal-textarea"
              placeholder="e.g. Customer changed mind, Item out of stock..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-cancel" onClick={onClose}>
              Keep Order
            </button>
            <button 
              className="btn btn-confirm" 
              onClick={handleSubmit}
              disabled={!reason.trim()}
            >
              Confirm Cancellation
            </button>
          </div>

        </div>
      </div>
    </>
  );
}