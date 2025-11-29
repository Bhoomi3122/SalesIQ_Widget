/**
 * ---------------------------------------------------------
 * SALESIQ FRONTEND SERVICE
 * ---------------------------------------------------------
 * This utility handles communication between your React app
 * (running in an iframe) and the Zoho SalesIQ Operator Widget.
 *
 * All iframe → parent postMessage logic goes here.
 */

const SALESIQ_ORIGIN = "*"; 
// In production, replace "*" with your exact domain if needed.
// Example: "https://salesiq.zohocloud.com"

/**
 * sendToSalesIQ
 * --------------
 * Sends a structured event back to the parent SalesIQ widget.
 *
 * @param {string} eventName
 * @param {object} payload
 */
export function sendToSalesIQ(eventName, payload = {}) {
  try {
    window.parent.postMessage(
      {
        event: eventName,
        payload,
      },
      SALESIQ_ORIGIN
    );

    console.log("[salesiq.js] Sent message → SalesIQ:", eventName, payload);
  } catch (err) {
    console.error("[salesiq.js] Failed to send postMessage:", err);
  }
}

/**
 * listenToSalesIQ
 * ----------------
 * Attach handler for messages from SalesIQ widget.
 *
 * @param {function} callback
 */
export function listenToSalesIQ(callback) {
  const handler = (event) => {
    if (!event?.data?.event) return;
    callback(event.data);
  };

  window.addEventListener("message", handler);

  return () => window.removeEventListener("message", handler);
}

/**
 * requestVisitorContext
 * ---------------------
 * Ask SalesIQ widget to resend visitor details.
 * Useful if iframe reloads or visitor changes.
 */
export function requestVisitorContext() {
  sendToSalesIQ("COPILOT_REQUEST_CONTEXT");
}

/**
 * notifyOperator
 * --------------
 * Used if you want to show any toast or notification
 * inside SalesIQ from the iframe.
 */
export function notifyOperator(message) {
  sendToSalesIQ("COPILOT_NOTIFY_OPERATOR", { message });
}

/**
 * sendAgentResponseToVisitor
 * --------------------------
 * Use this if you want operator messages to be sent through SalesIQ,
 * bypassing your backend (optional depending on architecture).
 *
 * NOTE: For most flows, sending messages through your backend
 * via `/api/operator/send-message` is preferred.
 */
export function sendAgentResponseToVisitor({ chatId, message }) {
  sendToSalesIQ("COPILOT_SEND_AGENT_MESSAGE", {
    chatId,
    message,
  });
}
