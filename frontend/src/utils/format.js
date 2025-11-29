import dayjs from "dayjs";

/**
 * formatPrice
 * -----------
 * Converts number → formatted currency string.
 * Shopify returns amounts as strings sometimes, so we coerce safely.
 */
export function formatPrice(amount, currency = "USD") {
  if (!amount) return "-";

  let value = parseFloat(amount);
  if (isNaN(value)) return amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * formatDate
 * ----------
 * Convert timestamps to a readable display format.
 * Shopify typically returns ISO timestamps.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD MMM YYYY");
}

/**
 * formatDateTime
 * --------------
 * Show both date and time.
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD MMM YYYY, hh:mm A");
}

/**
 * shorten
 * -------
 * Shortens long strings while keeping them readable.
 */
export function shorten(text, max = 40) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

/**
 * formatStatus
 * ------------
 * Converts Shopify status fields into clean UI strings.
 *
 * Example Shopify statuses:
 * - fulfillment_status = "fulfilled", "restocked", "null"
 * - financial_status = "paid", "pending", "refunded"
 */
export function formatStatus(status) {
  if (!status) return "Unknown";

  const clean = status.replace(/_/g, " ");

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * formatShipmentStatus
 * --------------------
 * Handles tracking statuses from fulfillment line items.
 */
export function formatShipmentStatus(tracking) {
  if (!tracking || !tracking.status) return "Not Available";
  const s = tracking.status.toLowerCase();

  if (s.includes("delivered")) return "Delivered";
  if (s.includes("transit")) return "In Transit";
  if (s.includes("out for delivery")) return "Out for Delivery";
  if (s.includes("failure")) return "Delivery Failed";
  if (s.includes("pending")) return "Pending";

  return formatStatus(s);
}

/**
 * formatName
 * ----------
 * Capitalizes customer names safely.
 */
export function formatName(name) {
  if (!name) return "-";
  return name
    .toLowerCase()
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(" ");
}
