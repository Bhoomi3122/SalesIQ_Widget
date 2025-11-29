/**
 * FORMATTING UTILITIES
 * ----------------------------------------------------
 * Pure JavaScript helpers for UI display. No external libraries required.
 */

/**
 * Converts number → formatted currency string.
 * Example: 1200.5 -> "$1,200.50"
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null) return '-';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(num);
}

/**
 * Convert timestamps to a readable display format.
 * Example: "2025-11-29T10:00:00Z" -> "Nov 29, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Show both date and time.
 * Example: "2025-11-29T10:00:00Z" -> "Nov 29, 2025, 10:00 AM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleTimeString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Shortens long strings while keeping them readable.
 */
export function shorten(text, max = 50) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}


/**
 * Converts status fields (e.g., "partially_refunded") into clean UI strings.
 */
export function formatStatus(status) {
  if (!status) return "Unknown";
  
  const clean = status.replace(/_/g, " ");

  // Capitalize each word (e.g., 'partially refunded' -> 'Partially Refunded')
  return clean.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

/**
 * Handles tracking statuses for display.
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