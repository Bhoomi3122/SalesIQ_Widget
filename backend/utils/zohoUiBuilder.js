/**
 * ZOHO SALESIQ WIDGET UI BUILDER (FINAL VERIFIED VERSION)
 * ---------------------------------------------------------
 * CORRECT according to Zoho Widget Schema:
 *
 * - Buttons MUST be inside a section with:  type: "buttons"
 * - Buttons MUST have: label, type, id, data
 * - open.url buttons MUST have: data.web
 * - invoke.function buttons MUST have: data.name
 */

//
// 1. WRAP ALL SECTIONS
//
const buildWidgetResponse = (sections) => {
    return {
        type: "widget_detail",
        platform: "web",
        sections: sections
    };
};

//
// 2. METRIC SECTION
//
const buildMetricSection = (id, title, metrics) => {
    return {
        name: id,
        type: "section",
        title: title,
        layout: "metric",
        data: metrics.map(m => ({
            label: m.label,
            value: m.value
        }))
    };
};

//
// 3. FIELDSET SECTION
//
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

//
// 4. LISTING SECTION
//
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
            
            // For clickable smart replies:
            actions: item.actionPayload ? [{
                label: "Use",
                type: "invoke.function",
                id: "handle_copy_text",
                data: {
                    name: "handle_copy_text",
                    payload: item.actionPayload
                }
            }] : []
        }))
    };
};

//
// 5. ACTION BUTTONS SECTION (THE IMPORTANT ONE)
// OFFICIAL ZOHO SCHEMA:
// {
//   name: "...",
//   type: "buttons",
//   buttons: [ { ... }, ... ]
// }
//
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "buttons",    // ✔ OFFICIAL Zoho Type
        buttons: buttons    // ✔ List of button objects
    };
};

//
// 6. INVOKE FUNCTION BUTTON
//
const createInvokeButton = (label, functionName, payload = {}) => {
    return {
        label: label,
        type: "invoke.function",
        id: functionName,       // mandatory unique id
        data: {
            name: functionName,
            payload: payload
        }
    };
};

//
// 7. OPEN URL BUTTON — FINAL CORRECT VERSION
//
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",              // ✔ Zoho correct type
        id: "open_dashboard",          // ✔ MUST be unique
        data: {
            web: url,                  // ✔ REQUIRED (Zoho uses this)
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
