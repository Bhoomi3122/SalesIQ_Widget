import React from "react";
import { FiCopy } from "react-icons/fi";
import EmptyState from "../EmptyState";

/**
 * CustomerCard
 * ------------
 * Professional compact customer info card with earthy theme.
 */

export default function CustomerCard({ visitor }) {
  if (!visitor || !visitor.email) {
    return (
      <EmptyState
        title="No Visitor Selected"
        subtitle="Accept a chat to view customer information."
      />
    );
  }

  const { name, email, phone, city, country } = visitor;

  // Initials
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : email[0]?.toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <>
      <style>{`
        .customer-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-medium);
          animation: fadeIn 0.35s ease-out;
        }

        .customer-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        /* HEADER */
        .customer-header {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .customer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-primary-light);
          border: 1.5px solid var(--color-primary);
          color: var(--color-primary-dark);
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
          box-shadow: var(--shadow-xs);
        }

        .customer-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .customer-email {
          font-size: 12px;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* INFO SECTION */
        .customer-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12.5px;
          line-height: 1.4;
        }

        .customer-field {
          display: flex;
          gap: 6px;
        }

        .customer-key {
          font-weight: 600;
          min-width: 64px;
          color: var(--text-primary);
        }

        .customer-value {
          color: var(--text-secondary);
        }

        /* COPY BUTTON */
        .customer-copy-btn {
          width: 100%;
          padding: 7px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          border-radius: var(--radius-md);
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          border: 1px solid var(--color-primary);
          transition: all var(--transition-medium);
          cursor: pointer;
        }

        .customer-copy-btn:hover {
          background: var(--color-primary);
          color: var(--text-light);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>

      <div className="customer-card">
        {/* Header: Avatar + Name */}
        <div className="customer-header">
          <div className="customer-avatar">{initials}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="customer-name">{name || "Unnamed Visitor"}</div>
            <div className="customer-email">{email}</div>
          </div>
        </div>

        <div className="zoho-divider"></div>

        {/* Info Fields */}
        <div className="customer-section">
          <div className="customer-field">
            <span className="customer-key">Email:</span>
            <span className="customer-value">{email}</span>
          </div>

          {phone && (
            <div className="customer-field">
              <span className="customer-key">Phone:</span>
              <span className="customer-value">{phone}</span>
            </div>
          )}

          {(city || country) && (
            <div className="customer-field">
              <span className="customer-key">Location:</span>
              <span className="customer-value">
                {city ? `${city}, ` : ""}
                {country}
              </span>
            </div>
          )}
        </div>

        <div className="zoho-divider"></div>

        {/* Copy Button */}
        <button className="customer-copy-btn" onClick={handleCopy}>
          <FiCopy size={14} />
          Copy Email
        </button>
      </div>
    </>
  );
}
