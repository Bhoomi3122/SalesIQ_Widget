/**
 * ZOHO WIDGET UI BUILDER (FINAL PRODUCTION VERSION)
 * ------------------------------------------------------------------
 * Fixes:
 * 1. Ensures ALL sections use 'name' (Fixes Section [0].name issue).
 * 2. Ensures every Button in the 'actions' array contains the mandatory 'id' and 'name' fields 
 * (Fixes response.sections[4].actions[1].name issue).
 * 3. Includes mandatory 'text' property in Listing Items.
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
                    name: "handle_copy_text", // MANDATORY: Required for invoke function
                    data: {
                        payload: item.actionPayload
                    }
                }]
                : []
        }))
    };
};

/**
 * 5. ACTION BUTTONS SECTION
 * This uses the 'info' layout to hold the buttons.
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        title: "Actions",

        // IMPORTANT: replace layout + actions with elements[] (SalesIQ format)
        elements: [
            {
                type: "buttons",
                buttons: buttons
            }
        ]
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
        id: functionName, // MANDATORY
        name: functionName, // MANDATORY: Function name for backend controller
        data: payload,
        style: style
    };
};

/**
 * 7. Link Button — Correct structure based on documentation analysis.
 * Requires 'id' and 'name' for the actions array parser.
 */
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",
        id: "open_full_dashboard",   // mandatory unique id
        url: url                     // MUST be top-level, not inside data{}
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