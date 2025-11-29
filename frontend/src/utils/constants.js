/**
 * GLOBAL CONSTANTS FOR OPERATOR COPILOT UI
 * ---------------------------------------------------------
 * Defines UI rules, status mappings, and shared component types.
 */

/**
 * 1. ORDER STATUS MAPPING (For Badge Colors & Labels)
 * Maps backend status strings to frontend visual rules.
 */
export const STATUS_MAPPING = {
    // Fulfilled/Delivered = Success
    fulfilled: { variant: "success", label: "Fulfilled" },
    delivered: { variant: "success", label: "Delivered" },
    
    // Cancellation/Refund = Danger
    cancelled: { variant: "danger", label: "Cancelled" },
    refunded: { variant: "danger", label: "Refunded" },
    
    // Pending/Transit/Unpaid = Warning/Info
    unfulfilled: { variant: "warning", label: "Unfulfilled" },
    pending: { variant: "warning", label: "Pending Payment" },
    in_transit: { variant: "info", label: "In Transit" },

    // Fallback
    unknown: { variant: "neutral", label: "Unknown" },
};

/**
 * 2. ACTION TYPES (Used by Modals and Buttons)
 * Defines the types of actions the Operator can perform.
 */
export const ACTION_TYPES = {
    // Actions requiring confirmation/forms
    CANCEL_ORDER: "cancel-order",
    RETURN_ORDER: "return-order",
    
    // Actions requiring UI overlay
    TRACK_ORDER: "track-order", 
    
    // Actions logging data (e.g., used by API)
    LOG_MESSAGE_SENT: "log-message-sent",
};

/**
 * 3. TRACKING TIMELINE STAGES (For OrderTimeline.jsx)
 * Defines the steps needed to construct the visual timeline.
 */
export const TRACKING_STAGES = [
    { id: 'placed', label: 'Order Placed', icon: 'Package' },
    { id: 'paid', label: 'Payment Processed', icon: 'CreditCard' },
    { id: 'shipped', label: 'Shipped', icon: 'Truck' },
    { id: 'delivered', label: 'Delivered', icon: 'CheckCircle' },
];


/**
 * 4. UI Placeholders (Default text when data is missing)
 */
export const PLACEHOLDERS = {
    NO_EMAIL: "No email available",
    NO_NAME: "Unknown Visitor",
    NO_ORDER_DATA: "Order details unavailable",
    NO_TRACKING: "Tracking information unavailable",
};

/**
 * 5. EXTERNAL LINKS (Used by Buttons)
 * These link to your deployed React Dashboard.
 * NOTE: Ensure the VITE_FRONTEND_URL is set in your local .env or Vercel/Render.
 */
export const FRONTEND_URLS = {
    DASHBOARD_BASE: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
};