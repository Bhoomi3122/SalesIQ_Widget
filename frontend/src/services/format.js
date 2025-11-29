/**
 * FORMATTING UTILITIES
 * ----------------------------------------------------
 * distinct helpers for UI display.
 * Used by: OrderCard, CustomerProfile, ShoppingGraph.
 */

/**
 * Formats a number as a price string.
 * Example: 1200.5 -> "$1,200.50"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '-';
  
  // Handle string inputs like "120.00"
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(num);
};

/**
 * Formats a raw date string into a clean, readable format.
 * Example: "2025-11-29T10:00:00Z" -> "Nov 29, 2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Invalid Date Check
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Capitalizes the first letter of a string.
 * Example: "fulfilled" -> "Fulfilled"
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formats a time string.
 * Example: "2025-11-29T10:00:00Z" -> "10:00 AM"
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Returns a color var name based on status string.
 * Useful for Badges.
 */
export const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (['fulfilled', 'delivered', 'paid', 'success'].includes(s)) return 'success';
  if (['pending', 'unfulfilled', 'in_transit', 'warning'].includes(s)) return 'warning';
  if (['cancelled', 'refunded', 'failed', 'danger'].includes(s)) return 'danger';
  return 'neutral';
};