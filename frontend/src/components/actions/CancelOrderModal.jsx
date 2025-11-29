import React, { useState } from "react";

/**
 * CancelOrderModal
 * ----------------
 * Clean compact modal for order cancellation.
 *
 * Props:
 * - visible (boolean)
 * - order (Shopify order)
 * - onClose()
 * - onConfirm(reason)
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
    onConfirm(reason || "No reason provided");
    setReason("");
  };

  return (
    <>
      <style>{`
        /* ------------------------------------------------------
           MODAL OVERLAY
        ------------------------------------------------------- */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: modalFadeIn 0.25s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ------------------------------------------------------
           MODAL CONTENT
        ------------------------------------------------------- */
        .modal-content {
          width: 360px;
          max-width: 92%;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          animation: modalSlideUp 0.28s ease-out;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ------------------------------------------------------
           HEADER
        ------------------------------------------------------- */
        .modal-title {
          font-size: var(--font-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .modal-subtitle {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          line-height: 1.45;
        }

        /* ------------------------------------------------------
           TEXTAREA
        ------------------------------------------------------- */
        .modal-label {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
          display: block;
        }

        .modal-textarea {
          width: 100%;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: var(--font-sm);
          resize: none;
          height: 80px;
          margin-bottom: var(--space-4);
          background: var(--color-surface-alt);
          transition: border var(--transition-fast);
        }

        .modal-textarea:focus {
          border-color: var(--color-primary);
          outline: none;
        }

        /* ------------------------------------------------------
           FOOTER BUTTONS
        ------------------------------------------------------- */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-2);
        }

      `}</style>

      <div className="modal-overlay">

        <div className="modal-content">

          {/* Title */}
          <h2 className="modal-title">Cancel Order</h2>

          {/* Subtitle */}
          <p className="modal-subtitle">
            You are about to cancel <strong>{order.name}</strong>.  
            Please provide a short reason.
          </p>

          {/* Textarea */}
          <label className="modal-label">Reason (optional)</label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="modal-textarea"
            placeholder="Example: Customer changed their mind"
          ></textarea>

          {/* Footer Buttons */}
          <div className="modal-footer">

            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>

            <button className="btn-danger" onClick={handleSubmit}>
              Confirm
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
