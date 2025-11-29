/**
 * GENERAL HELPER UTILITIES
 * ----------------------------------------------------
 * Functions for array manipulation, safe property access, and business logic checks.
 */

/**
 * isEmpty
 * -------
 * Checks if a value is null, undefined, blank string, or empty array/object.
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim().length === 0) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
}

/**
 * safeGet
 * -------
 * Safely accesses deep properties without crashing on null/undefined.
 * Example: safeGet(order, "customer.email")
 */
export function safeGet(obj, path, fallback = null) {
    try {
        return path.split(".").reduce((acc, key) => {
            if (acc && typeof acc === "object" && key in acc) {
                return acc[key];
            }
            return undefined; // Stop traversing if a key is missing
        }, obj) ?? fallback; // Return fallback if final value is undefined
    } catch {
        return fallback;
    }
}

/**
 * isValidEmail
 * ------------
 * Simple email validation used for visitor queries.
 */
export function isValidEmail(email) {
    if (isEmpty(email)) return false;
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

/**
 * hasFulfillment
 * ---------------
 * Checks if a live order object contains fulfillment details.
 */
export function hasFulfillment(order) {
    // We assume the order object fetched from the backend follows the Shopify fulfillment structure
    return (
        !isEmpty(order) &&
        Array.isArray(order.fulfillments) &&
        order.fulfillments.length > 0
    );
}

/**
 * getTrackingInfo
 * ----------------
 * Safely returns tracking info object from the order.
 */
export function getTrackingInfo(order) {
    if (!hasFulfillment(order)) return null;

    // Use the latest fulfillment details
    const fulfillment = order.fulfillments[0]; 
    if (!fulfillment || !fulfillment.tracking_info) return null;

    const t = fulfillment.tracking_info;
    return {
        number: t.number || safeGet(fulfillment, "tracking_number") || "-",
        company: t.company || safeGet(fulfillment, "tracking_company") || "-",
        url: t.url || safeGet(fulfillment, "tracking_url") || null,
        status: t.status || "Unknown",
    };
}

/**
 * sortByDate
 * -----------
 * Generic date sorting helper (descending).
 */
export function sortByDate(array, field = "created_at") {
    if (!Array.isArray(array)) return [];
    return array.slice().sort((a, b) => new Date(b[field]) - new Date(a[field]));
}

/**
 * unique
 * ------
 * Remove duplicates from array.
 */
export function unique(arr) {
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr)];
}

/**
 * delay
 * -----
 * Utility for awaiting small pauses (demo/debug).
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}