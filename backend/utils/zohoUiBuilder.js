/**
 * ZOHO SALESIQ WIDGET UI BUILDER – FINAL VERSION
 * Completely aligned with SalesIQ documentation.
 */

const buildWidgetResponse = (sections) => {
    return {
        type: "widget_detail",
        platform: "web",
        sections: sections
    };
};

// METRICS
const buildMetricSection = (id, title, metrics) => {
    return {
        name: id,
        type: "section",
        elements: [
            {
                type: "metric",
                title: title,
                data: metrics.map(m => ({
                    label: m.label,
                    value: m.value
                }))
            }
        ]
    };
};

// FIELDSET
const buildFieldsetSection = (id, title, fields) => {
    return {
        name: id,
        type: "section",
        elements: [
            {
                type: "fieldset",
                title: title,
                data: fields.map(f => ({
                    label: f.label,
                    value: f.value,
                    type: "text"
                }))
            }
        ]
    };
};

// LISTING SECTION
const buildListingSection = (id, title, items) => {
    return {
        name: id,
        type: "section",
        elements: [
            {
                type: "listing",
                title: title,
                data: items.map(item => ({
                    title: item.title,
                    text: item.text || item.subtext || "Details",
                    subtext: item.subtext || "",
                    image: item.image_url || "",
                    actions: item.actionPayload
                        ? [
                            {
                                label: "Copy",
                                type: "invoke.function",
                                name: "handle_copy_text",
                                id: "handle_copy_text",
                                data: item.actionPayload
                            }
                        ]
                        : []
                }))
            }
        ]
    };
};

// BUTTON SECTION — 100% MATCHES YOUR example
const buildActionsSection = (id, buttons) => {
    return {
        name: id,
        type: "section",
        elements: [
            {
                type: "buttons",
                buttons: buttons
            }
        ]
    };
};

// INVOKE BUTTON
const createInvokeButton = (label, functionName, payload = {}) => {
    return {
        label: label,
        type: "invoke.function",
        name: functionName,
        id: functionName,
        data: payload
    };
};

// OPEN URL BUTTON — EXACTLY LIKE YOUR EXAMPLE
const createLinkButton = (label, url) => {
    return {
        label: label,
        type: "open.url",
        id: "open_full_dashboard",
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
