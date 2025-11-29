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
        title: title || "",
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
            // Mandatory Field: Zoho crashes if 'text' is missing
            text: item.text || item.subtext || "Details", 
            subtext: item.subtext || "",
            image: item.image_url || "",
            
            action: item.actionPayload ? {
                type: "invoke.function",
                name: "handle_list_click",
                data: item.actionPayload
            } : null
        }))
    };
};

/**
 * FIXED: Changed layout from 'actions' to 'info'.
 * 'actions' is not a valid layout type. We use 'info' to hold the buttons.
 */
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        title: "Actions", // Section Header
        layout: "info",   // VALID LAYOUT
        data: [],         // Empty data (we just want the buttons)
        actions: buttons
    };
};

// --- BUTTON HELPERS ---

const createInvokeButton = (label, functionName, payload = {}, style = "primary") => {
    return {
        type: "invoke.function",
        label: label,
        name: functionName, // This triggers the 'action' handler in your backend
        data: payload,
        style: style 
    };
};

const createLinkButton = (label, url) => {
    return {
        type: "open.url",
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