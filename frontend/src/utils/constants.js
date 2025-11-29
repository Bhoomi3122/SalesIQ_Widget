/**
 * ---------------------------------------------------------
 * GLOBAL CONSTANTS FOR OPERATOR COPILOT UI
 * ---------------------------------------------------------
 */

/**
 * Order Status → Badge Variant Mapping
 */
export const STATUS_VARIANTS = {
  fulfilled: "green",
  delivered: "green",
  cancelled: "red",
  refunded: "red",
  partially_refunded: "yellow",
  pending: "yellow",
  in_transit: "blue",
  unfulfilled: "gray",
  unknown: "gray",
};

/**
 * Friendly Labels for Shopify Statuses
 */
export const STATUS_LABELS = {
  fulfilled: "Fulfilled",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
  pending: "Pending",
  in_transit: "In Transit",
  unfulfilled: "Unfulfilled",
  unknown: "Unknown",
};

/**
 * Mapping for order types / workflows
 */
export const WORKFLOW_TYPES = {
  CANCEL_ORDER: "cancel-order",
  RETURN_ORDER: "return-order",
  TRACK_ORDER: "track-order",
  SEND_MESSAGE: "send-message",
};

/**
 * AI Prompt Templates (Frontend Side)
 * Used when preparing AI payloads for backend
 */
export const AI_TEMPLATES = {
  REPLY_SUGGESTION:
    "Generate 3 short, professional customer support replies based on the conversation context below.",
  PRODUCT_RECOMMENDATION:
    "Recommend 3 products that match the user's intent and purchase history.",
  SENTIMENT_ANALYSIS:
    "Analyze the sentiment of the customer's last messages and classify it as positive, neutral, or negative.",
};

/**
 * API Route Constants
 * Used by api.js for clarity & maintainability
 */
export const API_ROUTES = {
  ORDERS_BY_EMAIL: (email) => `/api/operator/orders/${email}`,
  SMART_REPLY: "/api/operator/smart-reply",
  CANCEL_ORDER: "/api/operator/cancel-order",
  RETURN_ORDER: "/api/operator/return-order",
  TRACK_ORDER: "/api/operator/track-order",
  SEND_MESSAGE: "/api/operator/send-message",
  RECOMMEND_PRODUCTS: "/api/operator/recommend-products",
  CREATE_COUPON: "/api/operator/create-coupon",
};

/**
 * Fallback placeholders
 */
export const PLACEHOLDERS = {
  NO_EMAIL: "No email available",
  NO_NAME: "Unknown Visitor",
  NO_ORDER_DATA: "No order details available",
  NO_TRACKING: "Tracking info unavailable",
};

/**
 * UI Configurations
 */
export const UI_CONFIG = {
  MAX_NAME_LENGTH: 30,
  MAX_PRODUCT_TITLE_LENGTH: 50,
  MAX_MESSAGE_PREVIEW: 100,
};

/**
 * Shopify config
 */
export const SHOPIFY_CONSTANTS = {
  TRACKING_FIELDS: ["tracking_number", "tracking_company", "tracking_url"],
  SUPPORTED_CURRENCIES: ["USD", "INR", "EUR", "GBP", "AUD"],
};
