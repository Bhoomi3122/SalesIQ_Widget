import React from "react";
import useOrders from "../../hooks/useOrders";
import OrderCard from "./OrderCard";
import EmptyState from "../EmptyState";
import "../../styles/OrdersPanel.css";

/**
 * OrdersPanel
 * -----------
 * Displays Shopify orders for the current visitor.
 * Works ONLY with real backend data (no mocks).
 *
 * Props:
 * - visitor (object)
 * - onSelectOrder(order)
 */

export default function OrdersPanel({ visitor, onSelectOrder }) {
  const hasEmail = !!visitor?.email;

  // ❗ Call useOrders ONLY when a real visitor email exists
  const { orders, error, refreshOrders } = useOrders(hasEmail ? visitor : null);

  return (
    <div className="orders-panel card fade-in">
      {/* HEADER */}
      <div className="orders-header">
        <div className="orders-title-block">
          <span className="orders-title">Orders</span>
          {hasEmail && orders.length > 0 && (
            <span className="orders-count">({orders.length})</span>
          )}
        </div>

        {hasEmail && (
          <button
            className="btn-secondary orders-refresh-btn"
            onClick={refreshOrders}
          >
            <span className="orders-refresh-icon">🔄</span>
            Refresh
          </button>
        )}
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="orders-error">
          <span className="orders-error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* NO VISITOR SELECTED */}
      {!hasEmail && (
        <EmptyState
          title="No Visitor Selected"
          subtitle="Accept a chat to view their order history."
        />
      )}

      {/* NO ORDERS */}
      {hasEmail && orders.length === 0 && !error && (
        <EmptyState
          title="No Orders Found"
          subtitle={`No orders exist for ${visitor.email}.`}
        />
      )}

      {/* ORDERS LIST */}
      {hasEmail && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="orders-list-item"
              style={{
                animationDelay: `${0.2 + index * 0.05}s`,
              }}
            >
              <OrderCard
                order={order}
                onClick={() => onSelectOrder && onSelectOrder(order)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
