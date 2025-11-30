/**
 * ZOHO WIDGET UI BUILDER (FINAL PRODUCTION VERSION)
 * ------------------------------------------------------------------
 * Fixes:
 * 1. Ensures ALL sections use 'name'.
 * 2. Ensures Link Button provides the MANDATORY 'name' field, resolving the final UI error.
 */

/**
 * 1. THE WRAPPER
 * Wraps all sections into the final JSON response Zoho expects.
 */
const buildWidgetResponse = (sections) => {
    return {
        type: "widget_detail",
        platform: "web",
        sections: sections
    };
};

/**
 * 2. METRIC SECTION
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
 * 3. FIELDSET SECTION
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
            type: "text"
        }))
    };
};

/**
 * 4. LISTING SECTION
 * Note: Listing section buttons use 'id' as the unique key, as per the documentation's example structure.
 */
const buildListingSection = (id, title, items) => {
    return {
        name: id,
        type: "section",
        title: title,
        layout: "listing",
        data: items.map(item => ({
            title: item.title,
            text: item.text || item.subtext || "View Details",
            subtext: item.subtext || "",
            image: item.image_url || "",

            actions: item.actionPayload 
                ? [{
                    label: "Select",
                    type: "invoke.function",
                    id: "handle_copy_text", // Unique ID for this button instance
                    data: {
                        name: "handle_copy_text", 
                        payload: item.actionPayload
                    }
                }]
                : []
        }))
    };
};

/**
 * 5. ACTION BUTTONS SECTION
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        layout: "info", // Correct layout for buttons array
        title: "Actions",
        data: [],
        actions: buttons
    };
};

// --- BUTTON HELPERS ---

/**
 * 6. Invoke Button (Standard Action)
 * Requires 'name' for the function to be invoked.
 */
const createInvokeButton = (label, functionName, payload = {}, style = "primary") => {
    return {
        type: "invoke.function",
        label: label,
        name: functionName, // MANDATORY: Function name for backend controller
        data: payload,
        style: style
    };
};

/**
 * 7. Link Button — CRITICAL FIX: Add mandatory 'id' AND 'name' for reliability.
 * Note: open.url actions typically require the 'data' structure shown below.
 */
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",
        // CRITICAL FIX: Adding 'id' and 'name' which is required for items in the section actions array.
        id: "open_full_dashboard", 
        name: "open_url_action", // MANDATORY: This is what the action handler looks for!
        data: {
            web: url,
            windows: url,
            iOS: url,
            android: url
        }
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