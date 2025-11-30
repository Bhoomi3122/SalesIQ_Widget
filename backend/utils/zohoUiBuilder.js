/**
 * ZOHO WIDGET UI BUILDER (FINAL PRODUCTION VERSION)
 * ------------------------------------------------------------------
 * Fixes:
 * 1. REMOVED ILLEGAL 'layout' property from buildActionsSection.
 * 2. Rewrote buildActionsSection to use the proper 'elements' -> 'buttons' structure.
 * 3. Simplified Link Button structure to be minimal, based on documentation example.
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
 * This section uses actions embedded within the data array elements.
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

            // Actions for List Items (Click to Copy)
            actions: item.actionPayload 
                ? [{
                    label: "Select",
                    type: "invoke.function",
                    id: "handle_copy_text", 
                    name: "handle_copy_text", 
                    data: {
                        payload: item.actionPayload
                    }
                }]
                : []
        }))
    };
};

/**
 * 5. ACTION BUTTONS SECTION (CRITICALLY FIXED)
 * Uses the correct SalesIQ structure (elements array with type: "buttons").
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        title: "Actions", 
        // ❌ Removed 'layout: "info"'
        
        // ✅ Correct structure for buttons in SalesIQ widget sections
        elements: [
            {
                type: "buttons",
                buttons: buttons // Array of button objects defined below
            }
        ]
    };
};


// --- BUTTON HELPERS ---

/**
 * 6. Invoke Button (Standard Action)
 */
const createInvokeButton = (label, functionName, payload = {}, style = "primary") => {
    return {
        type: "invoke.function",
        label: label,
        id: functionName, 
        name: functionName, // MANDATORY: Function name for backend controller
        data: payload,
        style: style
    };
};

/**
 * 7. Link Button — FINAL FIX: Using simple URL structure.
 * Note: Zoho requires 'id' for the parent 'buttons' array, and 'url' at the root.
 */
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",
        id: "open_full_dashboard", // MANDATORY: Unique ID for the parent buttons array
        
        // ✅ CORRECT STRUCTURE: URL is a top-level key for open.url type
        url: url, 
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