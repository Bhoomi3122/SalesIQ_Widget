import React, { useState } from "react";

/**
 * SendMessageModal
 * ----------------
 * Earthy compact modal for sending a custom message.
 *
 * Props:
 * - visible
 * - visitor
 * - onClose
 * - onSend(message)
 */

export default function SendMessageModal({ visible, visitor, onClose, onSend }) {
  const [message, setMessage] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }
    onSend(message);
    setMessage("");
  };

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
           MODAL CONTENT
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
           TITLE & SUBTITLE
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
           TEXTAREA
        ------------------------------------------------------- */
        .modal-textarea {
          width: 100%;
          resize: none;
          padding: var(--space-2);
          height: 100px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-surface-alt);
          font-size: var(--font-sm);
          line-height: 1.45;
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
          <h2 className="modal-title">Send Message</h2>

          {/* Subtitle */}
          <p className="modal-subtitle">
            This message will be delivered directly to the visitor.
          </p>

          {/* Message Input */}
          <label className="modal-label">Message</label>
          <textarea
            className="modal-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          ></textarea>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>

            <button className="btn-primary" onClick={handleSubmit}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
