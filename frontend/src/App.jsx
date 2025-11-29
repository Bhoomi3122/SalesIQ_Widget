import React, { useEffect, useState } from "react";

import { useVisitorContext } from "./context/VisitorContext";
import { useUIContext } from "./context/UIContext";

import Header from "./components/layout/Header";
import CustomerCard from "./components/customer/CustomerCard";
import OrdersPanel from "./components/orders/OrdersPanel";
import AiPanel from "./components/ai/AiPanel";
import ActionsPanel from "./components/actions/ActionsPanel";

import CancelOrderModal from "./components/actions/CancelOrderModal";
import ReturnOrderModal from "./components/actions/ReturnOrderModal";
import SendMessageModal from "./components/actions/SendMessageModal";

import Loader from "./components/ui/Loader";
import EmptyState from "./components/EmptyState";

import {
  cancelOrder,
  createReturn,
  sendMessageToVisitor,
} from "./services/api";

import "./styles/global.css";
import "./styles/components.css";
import "./styles/variables.css";
import "./styles/orderCard.css";
import "./styles/actionsPanel.css";
import "./styles/OrderTimeline.css";
import "./styles/OrdersPanel.css";

export default function App() {
  const { visitor, visitorReady } = useVisitorContext();
  const { modal, loading, openModal, closeModal, startLoading, stopLoading } =
    useUIContext();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // -----------------------------------------------------
  //  NO MOCK VISITOR — PRODUCTION MODE ONLY
  // -----------------------------------------------------

  // Wait until visitor arrives from SalesIQ
  if (!visitorReady) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EmptyState
          title="Loading visitor..."
          subtitle="Waiting for visitor data from SalesIQ."
        />
      </div>
    );
  }

  // -----------------------------------------------------
  // REAL BACKEND ACTION HANDLERS
  // -----------------------------------------------------

  const handleCancelOrder = async (reason) => {
    try {
      startLoading();
      const payload = {
        email: visitor.email,
        orderNumber: selectedOrder?.orderNumber,
        reason,
      };

      await cancelOrder(payload);
      closeModal();
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel order.");
    } finally {
      stopLoading();
    }
  };

  const handleReturnOrder = async ({ reason, note }) => {
    try {
      startLoading();
      const payload = {
        email: visitor.email,
        orderNumber: selectedOrder?.orderNumber,
        reason,
        note,
      };

      await createReturn(payload);
      closeModal();
    } catch (err) {
      console.error("Return error:", err);
      alert("Failed to create return.");
    } finally {
      stopLoading();
    }
  };

  const handleSendMessage = async (msg) => {
    try {
      startLoading();
      const payload = {
        visitorId: visitor.visitorId,
        message: msg,
      };

      await sendMessageToVisitor(payload);
      closeModal();
    } catch (err) {
      console.error("Message send error:", err);
      alert("Failed to send message.");
    } finally {
      stopLoading();
    }
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Loader text="Processing..." />
        </div>
      )}

      {/* MAIN GRID */}
      <div
        style={{
          padding: "14px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "14px",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <CustomerCard visitor={visitor} />

          <OrdersPanel
            visitor={visitor}
            onSelectOrder={(o) => setSelectedOrder(o)}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <AiPanel
            visitor={visitor}
            orders={selectedOrder ? [selectedOrder] : []}
          />

          <ActionsPanel
            visitor={visitor}
            order={selectedOrder}
            onCancel={() => openModal("cancel-order")}
            onReturn={() => openModal("return-order")}
            onTrack={() => alert("Tracking coming soon…")}
            onSendMessage={() => openModal("send-message")}
            onCreateCoupon={() => alert("Coupon feature coming soon")}
          />
        </div>
      </div>

      {/* MODALS */}
      <CancelOrderModal
        visible={modal === "cancel-order"}
        order={selectedOrder}
        onClose={closeModal}
        onConfirm={handleCancelOrder}
      />

      <ReturnOrderModal
        visible={modal === "return-order"}
        order={selectedOrder}
        onClose={closeModal}
        onConfirm={handleReturnOrder}
      />

      <SendMessageModal
        visible={modal === "send-message"}
        visitor={visitor}
        onClose={closeModal}
        onSend={handleSendMessage}
      />
    </div>
  );
}
