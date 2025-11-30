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
 * Only modifying the action → actions[] as per Zoho spec.
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

            // FIXED FOR ZOHO SPEC:
            actions: item.actionPayload 
                ? [{
                    label: "Select",
                    type: "invoke.function",
                    id: "handle_copy_text",
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
 * (KEEPING EXACT same structure, only the button objects are fixed)
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        layout: "info",
        title: "Actions",
        data: [],
        actions: buttons
    };
};

// --- BUTTON HELPERS ---

/**
 * 6. Invoke Button (no change)
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
 * 7. Link Button — FIXED to Zoho's proper open.url schema
 *    ONLY this part changed.
 */
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",
        id: "open_dashboard",    // Zoho requires unique ID field
        data: {
            web: url,            // Zoho requires .data.web for URL
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
