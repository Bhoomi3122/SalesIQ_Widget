import React from "react";
import EmptyState from "../EmptyState.jsx";
import "../../styles/actionsPanel.css";

/**
 * ActionsPanel
 * ------------
 * Uses the REAL backend order shape:
 *
 * {
 *   orderNumber: "#1003",
 *   financialStatus: "paid",
 *   fulfillmentStatus: "fulfilled",
 *   shippingStatus: "delivered",
 *   totalPrice: "720.00",
 *   currency: "USD",
 *   line_items: [
 *     { name: "Product", quantity: 1, price: "200.00" }
 *   ],
 *   createdAt: "...",
 *   id: "123456"
 * }
 */

export default function ActionsPanel({
  order,
  visitor,
  onCancel,
  onReturn,
  onTrack,
  onSendMessage,
  onCreateCoupon,
}) {
  if (!visitor?.email) {
    return (
      <EmptyState
        title="No Visitor Selected"
        subtitle="Accept a chat to view actions for this customer."
      />
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="No Order Selected"
        subtitle="Choose an order to perform workflow actions."
      />
    );
  }

  /** ----------------------------------------
   * MAP REAL BACKEND ORDER FIELDS
   * ---------------------------------------- */
  const orderNumber = order.orderNumber;
  const total = order.totalPrice;
  const currency = order.currency;

  const items = order.line_items || [];

  // unified status
  const status =
    order.shippingStatus ||
    order.fulfillmentStatus ||
    order.financialStatus ||
    "unknown";

  const financial = order.financialStatus;

  const trackingAvailable =
    order.shippingStatus === "delivered" ||
    order.fulfillmentStatus === "fulfilled";

  return (
    <div className="actions-panel-container card fade-in">
      {/* Header */}
      <div className="actions-panel-header">Quick Actions</div>

      <p className="actions-panel-subtitle">
        Perform customer workflows instantly from here.
      </p>

      {/* Order Summary */}
      <div className="actions-panel-summary">
        <div className="actions-panel-summary-name">{orderNumber}</div>

        <div className="actions-panel-summary-details">
          {currency} {total} • {status}
        </div>
      </div>

      {/* Buttons */}
      <div className="actions-panel-buttons">
        <button
          className="btn-primary actions-panel-button"
          onClick={() => onTrack && onTrack(order)}
          disabled={!trackingAvailable}
        >
          {trackingAvailable ? "Track Shipment" : "Tracking Not Available"}
        </button>

        <button
          className="btn-secondary actions-panel-button"
          onClick={() => onReturn && onReturn(order)}
          disabled={status !== "delivered" && status !== "fulfilled"}
        >
          Initiate Return
        </button>

        <button
          className="btn-danger actions-panel-button"
          onClick={() => onCancel && onCancel(order)}
          disabled={financial === "refunded" || status === "cancelled"}
        >
          Cancel Order
        </button>

        <button
          className="btn-secondary actions-panel-button"
          onClick={onCreateCoupon}
        >
          Create / Apply Coupon
        </button>

        <button
          className="btn-primary actions-panel-button"
          onClick={onSendMessage}
        >
          Send Custom Message
        </button>
      </div>

      <div className="actions-panel-divider zoho-divider"></div>

      {/* Items */}
      <h3 className="actions-panel-items-title">Items</h3>

      {items.map((item, idx) => (
        <div
          key={idx}
          className="actions-panel-item"
          style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
        >
          <div className="actions-panel-item-title">{item.name}</div>
          <div className="actions-panel-item-details">
            {item.quantity}× — {currency} {item.price}
          </div>
        </div>
      ))}
    </div>
  );
}
