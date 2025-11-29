import React from "react";
import "../../styles/orderCard.css";

/**
 * OrderCard
 * ---------
 * Clean card showing summary of one order.
 *
 * Props:
 * - order (backend order object EXACT SHAPE)
 * - onClick (optional)
 */

export default function OrderCard({ order, onClick }) {
  if (!order) return null;

  const {
    orderNumber,
    financialStatus,
    fulfillmentStatus,
    shippingStatus,
    totalPrice,
    currency,
    line_items,
    createdAt,
  } = order;

  /** ------------------------------
   * STATUS MAPPING (BACKEND EXACT FIELDS)
   * ------------------------------ */
  const status =
    shippingStatus ||
    fulfillmentStatus ||
    financialStatus ||
    "unknown";

  const statusMap = {
    delivered: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success)",
      label: "Delivered",
    },
    fulfilled: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success)",
      label: "Fulfilled",
    },
    paid: {
      bg: "var(--status-info-bg)",
      color: "var(--status-info)",
      label: "Paid",
    },
    refunded: {
      bg: "var(--status-danger-bg)",
      color: "var(--status-danger)",
      label: "Refunded",
    },
    pending: {
      bg: "var(--status-warning-bg)",
      color: "var(--status-warning)",
      label: "Pending",
    },
    unknown: {
      bg: "var(--border-light)",
      color: "var(--text-muted)",
      label: "Unknown",
    },
  };

  const badge = statusMap[status] || statusMap["unknown"];

  return (
    <div
      className="order-card order-card-animate"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Header */}
      <div className="order-card-header">
        <span className="order-card-name">{orderNumber}</span>

        <span
          className="order-card-badge"
          style={{
            background: badge.bg,
            color: badge.color,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Date */}
      <div className="order-card-date">
        {new Date(createdAt).toLocaleString()}
      </div>

      {/* Items */}
      <div className="order-card-items">
        {line_items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="order-card-item">
            {item.quantity}× {item.name}
          </div>
        ))}

        {line_items.length > 2 && (
          <div className="order-card-more-items">
            +{line_items.length - 2} more items
          </div>
        )}
      </div>

      <div className="zoho-divider"></div>

      {/* Footer */}
      <div className="order-card-footer">
        <div className="order-card-total">
          {currency} {totalPrice}
        </div>

        <div className="order-card-tracking">
          {shippingStatus === "delivered" ||
          fulfillmentStatus === "fulfilled"
            ? "Delivered"
            : "Track Order →"}
        </div>
      </div>
    </div>
  );
}
