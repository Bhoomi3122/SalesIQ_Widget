/**
 * -------------------------------------------------------
 * AI FRONTEND HELPERS — MOCK SAFE VERSION
 * -------------------------------------------------------
 * These utilities ONLY transform data.
 * No network or backend calls happen here.
 * -------------------------------------------------------
 */

/**
 * Clean user input for AI safety and clarity
 */
export function cleanMessage(msg) {
  if (!msg) return "";
  return msg
    .replace(/\s+/g, " ")
    .replace(/[\n\r]+/g, " ")
    .trim();
}

/**
 * Build compact chat context for AI
 */
export function buildChatContext(messages = [], limit = 6) {
  if (!Array.isArray(messages)) return "";

  return messages
    .slice(-limit)
    .map((m) => {
      const role = m.from === "visitor" ? "Customer" : "Agent";
      return `${role}: ${cleanMessage(m.text)}`;
    })
    .join("\n");
}

/**
 * Build single order summary
 */
export function buildOrderSummary(order) {
  if (!order) return "No order data available.";

  const items = (order.line_items || [])
    .map((i) => `${i.quantity}x ${i.name || i.title || ""}`)
    .join(", ");

  return `
Order ID: ${order.id}
Status: ${order.fulfillment_status || "unknown"}
Financial: ${order.financial_status || "unknown"}
Items: ${items}
Total: ${order.total_price} ${order.currency || ""}
Created: ${order.created_at}
  `.trim();
}

/**
 * Build multi-order summary for history context
 */
export function buildMultipleOrdersSummary(orders = []) {
  if (!orders.length) return "Customer has no previous orders.";

  return orders
    .slice(0, 3)
    .map((o, index) => {
      const items = (o.line_items || [])
        .map((i) => `${i.quantity}x ${i.name || i.title || ""}`)
        .join(", ");

      return `
[Order ${index + 1}]
ID: ${o.id}
Items: ${items}
Total: ${o.total_price} ${o.currency}
Status: ${o.fulfillment_status || "unknown"}
Created: ${o.created_at}
      `.trim();
    })
    .join("\n\n");
}

/**
 * Clean AI responses
 */
export function normalizeAIResponse(text) {
  if (!text) return "";
  return text
    .replace(/^\s+|\s+$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Prepare Smart Reply request payload
 */
export function prepareReplySuggestionPayload({
  messages = [],
  latestOrder = null,
  visitor = {},
}) {
  return {
    chatContext: buildChatContext(messages),
    orderSummary: buildOrderSummary(latestOrder),
    visitorEmail: visitor.email || "",
    visitorName: visitor.name || "",
  };
}

/**
 * Prepare Recommendation payload
 */
export function prepareRecommendationPayload({ visitor = {}, intent = "" }) {
  return {
    email: visitor.email || "",
    intent: cleanMessage(intent),
  };
}
