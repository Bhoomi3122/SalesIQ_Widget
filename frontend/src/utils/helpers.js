/**
 * isEmpty
 * -------
 * Checks if a value is empty, null, undefined, or blank string.
 */
export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

/**
 * safeGet
 * -------
 * Safe deep property access.
 * Example: safeGet(order, "customer.email")
 */
export function safeGet(obj, path, fallback = null) {
  try {
    return path.split(".").reduce((acc, key) => {
      if (acc && typeof acc === "object") return acc[key];
      return fallback;
    }, obj);
  } catch {
    return fallback;
  }
}

/**
 * capitalize
 * ----------
 * Capitalizes any string safely.
 */
export function capitalize(text) {
  if (!text || typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * isValidEmail
 * ------------
 * Email validation used for visitor queries.
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * hasFulfillment
 * ---------------
 * Checks if Shopify order has fulfillment(s).
 */
export function hasFulfillment(order) {
  return (
    order &&
    Array.isArray(order.fulfillments) &&
    order.fulfillments.length > 0
  );
}

/**
 * getTrackingInfo
 * ----------------
 * Safely return tracking info from Shopify order/fillment.
 */
export function getTrackingInfo(order) {
  if (!hasFulfillment(order)) return null;

  const fulfillment = order.fulfillments[0]; // usually only one
  if (!fulfillment || !fulfillment.tracking_info) return null;

  const t = fulfillment.tracking_info;
  return {
    number: t.number || "-",
    company: t.company || "-",
    url: t.url || null,
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
  return array.sort((a, b) => new Date(b[field]) - new Date(a[field]));
}

/**
 * unique
 * ------
 * Remove duplicates from array.
 */
export function unique(arr) {
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
