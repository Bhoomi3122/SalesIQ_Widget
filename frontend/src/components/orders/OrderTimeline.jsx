import React from "react";
import { getOrderSummaryForUI, getTrackingInfo } from "../services/shopify";
import EmptyState from "./EmptyState";
import "../styles/orderTimeline.css";

/**
 * OrderTimeline
 * -------------
 * Shows timeline view of a selected order.
 *
 * Props:
 * - order (Shopify raw order object)
 */

export default function OrderTimeline({ order }) {
  if (!order) {
    return (
      <EmptyState
        title="No Order Selected"
        subtitle="Select an order to view its timeline and details."
      />
    );
  }

  const summary = getOrderSummaryForUI(order);
  const tracking = getTrackingInfo(order);

  const { name, status, financial, date, items, total, currency } = summary;

  // Build timeline steps
  const steps = [];

  // 1. Order Placed
  steps.push({
    label: "Order Placed",
    description: new Date(date).toLocaleString(),
    color: "var(--status-info)",
  });

  // 2. Payment
  steps.push({
    label: `Payment: ${financial || "Unknown"}`,
    description: financial === "paid" ? "Payment received" : "Awaiting payment",
    color:
      financial === "paid"
        ? "var(--status-success)"
        : "var(--status-warning)",
  });

  // 3. Fulfillment / Shipping
  if (status === "fulfilled" || status === "delivered") {
    steps.push({
      label: "Order Fulfilled",
      description: "Items shipped to the customer",
      color: "var(--status-success)",
    });
  } else if (status === "in_transit") {
    steps.push({
      label: "In Transit",
      description: "Order is on the way",
      color: "var(--status-info)",
    });
  } else {
    steps.push({
      label: "Not Fulfilled Yet",
      description: "Order is awaiting fulfillment",
      color: "var(--text-muted)",
    });
  }

  // 4. Tracking updates
  if (tracking) {
    steps.push({
      label: "Tracking Update",
      description: tracking.company
        ? `${tracking.company} — ${tracking.trackingNumber}`
        : "Tracking details available",
      color: "var(--brand-blue)",
    });

    if (tracking.trackingUrl) {
      steps.push({
        label: "Track Online",
        description: tracking.trackingUrl,
        link: tracking.trackingUrl,
        color: "var(--brand-blue)",
      });
    }
  }

  // 5. Delivered
  if (status === "delivered") {
    steps.push({
      label: "Order Delivered",
      description: "The customer received the order",
      color: "var(--status-success)",
    });
  }

  // 6. Cancelled / Refunded
  if (status === "cancelled" || financial === "refunded") {
    steps.push({
      label: "Order Cancelled / Refunded",
      description: "Refund processed back to the customer",
      color: "var(--status-danger)",
    });
  }

  return (
    <div className="timeline-container card fade-in">
      {/* Title */}
      <h3 className="timeline-title">{name}</h3>
      <p className="timeline-total">
        {currency} {total}
      </p>

      <div className="zoho-divider"></div>

      {/* Timeline Steps */}
      <div className="timeline-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className="timeline-step"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="timeline-dot"
              style={{
                background: step.color,
                boxShadow: `0 0 0 4px ${step.color}20`,
              }}
            ></div>

            {index !== steps.length - 1 && <div className="timeline-line"></div>}

            <div className="timeline-content">
              <div className="timeline-label">{step.label}</div>

              {step.link ? (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-link"
                >
                  Track Shipment →
                </a>
              ) : (
                <div className="timeline-description">{step.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="zoho-divider"></div>

      {/* Items */}
      <h4 className="timeline-items-title">Items</h4>

      <div className="timeline-items">
        {items.map((item, i) => (
          <div
            key={i}
            className="timeline-item"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="timeline-item-title">{item.title}</div>
            <div className="timeline-item-details">
              {item.quantity}× — {currency} {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
