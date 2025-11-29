/**
 * ZOHO WIDGET UI BUILDER (FINAL PRODUCTION VERSION)
 * ------------------------------------------------------------------
 * fixes:
 * 1. Swapped 'id' property to 'name' (Zoho Schema Requirement).
 * 2. Added mandatory 'text' property to Listing Items (Prevents crash).
 * 3. Added mandatory 'name' property to Link Buttons (Fixes current crash).
 */

/**
 * 1. THE WRAPPER
 * Wraps all sections into the final JSON response Zoho expects.
 */
const buildWidgetResponse = (sections) => {
    return {
        type: "widget_detail",
        platform: "web", // Target platform
        sections: sections
    };
};

/**
 * 2. METRIC SECTION (The "Heads Up" Display)
 * Use this for high-impact numbers like Sentiment Score, LTV, or Order Count.
 * @param {string} id - Unique Name for the section
 * @param {string} title - (Optional) Section Header
 * @param {Array} metrics - Array of objects: [{ label: "Sentiment", value: "😊 Positive" }]
 */
const buildMetricSection = (id, title, metrics) => {
    return {
        name: id,
        type: "section",
        title: title || "",
        layout: "metric",
        data: metrics.map(m => ({
            label: m.label,
            value: m.value
        }))
    };
};

/**
 * 3. FIELDSET SECTION (Structured Details)
 * Use this for Customer Profiles (Name, Email, Segment) or Order Details.
 * Renders as clean rows of Key: Value.
 * @param {string} id - Unique Name for the section
 * @param {string} title - Section Header
 * @param {Array} fields - Array of objects: [{ label: "Email", value: "user@example.com" }]
 */
const buildFieldsetSection = (id, title, fields) => {
    return {
        name: id,
        type: "section",
        title: title,
        layout: "fieldset",
        data: fields.map(f => ({
            label: f.label,
            value: f.value,
            type: "text" // Default to text display
        }))
    };
};

/**
 * 4. LISTING SECTION (Rich Visuals)
 * Use this for Product Recommendations or Order History.
 * Supports images to make the widget look "Premium".
 * * FIX APPLIED: Mapped 'text' field which is mandatory for Zoho.
 * @param {string} id - Unique Name for the section
 * @param {string} title - Section Header
 * @param {Array} items - Array of objects
 */
const buildListingSection = (id, title, items) => {
    return {
        name: id,
        type: "section",
        title: title,
        layout: "listing",
        data: items.map(item => ({
            title: item.title,
            // FIXED: 'text' is mandatory. If missing, fallback to subtext or placeholder.
            text: item.text || item.subtext || "View Details", 
            subtext: item.subtext || "",
            image: item.image_url || "", // If empty, Zoho shows a default icon
            
            // Action is optional (only if payload exists)
            action: item.actionPayload ? {
                type: "invoke.function",
                name: "handle_list_click", // This function name is caught by your backend
                data: item.actionPayload
            } : null
        }))
    };
};

/**
 * 5. ACTION BUTTONS (The Control Panel)
 * Renders the primary buttons at the bottom.
 * @param {string} id - Unique Name for the section
 * @param {Array} buttons - Array of objects created by button helpers below.
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        layout: "info", // Changed from 'actions' to 'info' as 'actions' layout is not supported
        title: "Actions",
        data: [],
        actions: buttons
    };
};

// --- BUTTON HELPERS ---

/**
 * Creates a button that calls YOUR backend (e.g., "Refund", "Refresh AI")
 * @param {string} label - Text on button (e.g., "Refresh Analysis")
 * @param {string} functionName - Internal name to track usage (e.g., "refresh_ai")
 * @param {object} payload - Data to send back to backend (e.g., { visitorId: 123 })
 * @param {string} style - 'primary' (Blue), 'danger' (Red), or 'default' (Grey)
 */
const createInvokeButton = (label, functionName, payload = {}, style = "primary") => {
    return {
        type: "invoke.function",
        label: label,
        name: functionName,
        data: payload,
        style: style 
    };
};

/**
 * Creates a button that opens a NEW TAB (e.g., "Open Pro Dashboard")
 * FIX APPLIED: Added mandatory 'name' field.
 * @param {string} label - Text on button
 * @param {string} url - The URL to open (Your React App)
 */
const createLinkButton = (label, url) => {
    return {
        type: "open.url",
        // Mandatory Field Fix: Zoho crashes if 'name' is missing for actions
        name: "open_url_action", 
        label: label,
        url: url
    };
};

module.exports = {
    buildWidgetResponse,
    buildMetricSection,
    buildFieldsetSection,
    buildListingSection,
    buildActionsSection,
    createInvokeButton,
    createLinkButton
};