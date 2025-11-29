import React, { useState } from "react";

/**
 * ReturnOrderModal
 * ----------------
 * Modern compact modal for order returns.
 *
 * Props:
 * - visible (boolean)
 * - order (Shopify order)
 * - onClose()
 * - onConfirm({ reason, note })
 */

export default function ReturnOrderModal({
  visible,
  order,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  if (!visible || !order) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please select a reason for the return.");
      return;
    }
    onConfirm({ reason, note });
    setReason("");
    setNote("");
  };

  const returnReasons = [
    "Wrong item received",
    "Damaged product",
    "Size/fit issue",
    "Product not as described",
    "Changed my mind",
    "Delivered late",
  ];

  return (
    <>
      <style>{`
        /* ------------------------------------------------------
           OVERLAY
        ------------------------------------------------------- */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
          animation: modalFadeIn 0.25s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ------------------------------------------------------
           MODAL BOX
        ------------------------------------------------------- */
        .modal-content {
          width: 360px;
          max-width: 92%;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: var(--space-4);
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
          line-height: 1.45;
          margin-bottom: var(--space-4);
        }

        /* ------------------------------------------------------
           LABEL
        ------------------------------------------------------- */
        .modal-label {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
          display: block;
        }

        /* ------------------------------------------------------
           SELECT
        ------------------------------------------------------- */
        .modal-select {
          width: 100%;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: var(--font-sm);
          margin-bottom: var(--space-4);
          background: var(--color-surface-alt);
          transition: border var(--transition-fast);
        }

        .modal-select:focus {
          border-color: var(--color-primary);
          outline: none;
        }

        /* ------------------------------------------------------
           TEXTAREA
        ------------------------------------------------------- */
        .modal-textarea {
          width: 100%;
          resize: none;
          padding: var(--space-2);
          height: 80px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: var(--font-sm);
          background: var(--color-surface-alt);
          margin-bottom: var(--space-4);
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
          <h2 className="modal-title">Initiate Return</h2>

          {/* Subtitle */}
          <p className="modal-subtitle">
            You are processing a return for <strong>{order.name}</strong>.
            Select a valid return reason below.
          </p>

          {/* Reason */}
          <label className="modal-label">Return Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="modal-select"
          >
            <option value="">Select a reason</option>
            {returnReasons.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Notes */}
          <label className="modal-label">Notes (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Example: Customer reported damaged product"
            className="modal-textarea"
          ></textarea>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>

            <button className="btn-primary" onClick={handleSubmit}>
              Confirm Return
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
