/**
 * ZOHO WIDGET UI BUILDER (FINAL FIXED VERSION)
 * -------------------------------------------------------------
 * MAIN FIX:
 * createLinkButton MUST store URL inside `data: { url }`
 * because SalesIQ sends:
 * 
 * action: {
 *    name: "open_url_action",
 *    data: { url: "https://..." }
 * }
 *
 * Without this, backend receives {}, causing the dashboard button to fail.
 */

const buildWidgetResponse = (sections) => {
    return {
        type: "widget_detail",
        platform: "web",
        sections: sections
    };
};

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
            actions: item.actionPayload ? [{
                type: "invoke.function",
                name: "handle_copy_text",
                data: item.actionPayload
            }] : []

        }))
    };
};

const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        title: "Actions",
        layout: "actions",   // Supported layout for buttons
        data: [],            // ✔ Mandatory (Zoho requires it)
        actions: buttons     // ✔ Where your invoke/link buttons go
    };
};


const createInvokeButton = (label, functionName, payload = {}, style = "primary") => {
    return {
        type: "invoke.function",
        label,
        name: functionName,
        data: payload,
        style
    };
};

/**
 * FINAL FIX ✔✔
 * - SalesIQ requires link buttons to be type: "button"
 * - Backend expects action.name = "open_url_action"
 * - URL must be inside data: { url: "..." }
 */
const createLinkButton = (label, url) => {
    return {
        type: "button",          // Zoho treats this as a clickable action
        name: "open_url_action", // Backend matches this
        label: label,
        data: {
            url: url             // CRITICAL FIX ✔
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
