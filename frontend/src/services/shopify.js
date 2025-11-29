/**
 * ---------------------------------------------------------
 * SHOPIFY FRONTEND DATA HELPERS
 * ---------------------------------------------------------
 * These functions take raw Shopify API responses (fetched
 * from your backend) and transform them into clean,
 * UI-friendly objects.
 */

/**
 * getOrderStatus
 * --------------
 * Returns fulfillment + financial status in a clean format.
 */
export function getOrderStatus(order) {
  if (!order) return "Unknown";

  const fulfillment = order.fulfillment_status || "unfulfilled";
  const financial = order.financial_status || "pending";

  return `${fulfillment} / ${financial}`;
}

/**
 * getFormattedLineItems
 * ---------------------
 * Cleanly formats ordered items for UI consumption.
 */
export function getFormattedLineItems(order) {
  if (!order || !Array.isArray(order.line_items)) return [];

  return order.line_items.map((item) => ({
    id: item.id,
    title: item.name,
    quantity: item.quantity,
    price: Number(item.price || 0),
    sku: item.sku || "",
    variant: item.variant_title || "",
  }));
}

/**
 * getCustomerInfo
 * ---------------
 * Extract customer data safely.
 */
export function getCustomerInfo(order) {
  const customer = order?.customer || {};

  return {
    id: customer.id || null,
    email: customer.email || "",
    name: customer.first_name
      ? `${customer.first_name} ${customer.last_name || ""}`.trim()
      : "",
  };
}

/**
 * getTrackingInfo
 * ---------------
 * Extracts tracking information if available.
 */
export function getTrackingInfo(order) {
  const fulfillments = order?.fulfillments;

  if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
    return null;
  }

  const f = fulfillments[0]; // Usually only one fulfillment

  return {
    company: f.tracking_company || null,
    trackingNumber:
      f.tracking_number || f.tracking_numbers?.[0] || null,
    trackingUrl:
      f.tracking_url || f.tracking_urls?.[0] || null,
    status: f.shipment_status || "Unknown",
  };
}

/**
 * getOrderTotals
 * --------------
 * Extracts total amount details from Shopify order.
 */
export function getOrderTotals(order) {
  return {
    subtotal: Number(order?.subtotal_price || 0),
    shipping: Number(order?.total_shipping_price_set?.shop_money?.amount || 0),
    taxes: Number(order?.total_tax || 0),
    discount: Number(order?.total_discounts || 0),
    total: Number(order?.total_price || 0),
    currency: order?.currency || "USD",
  };
}

/**
 * getShippingAddress
 * ------------------
 * Extracts shipping address cleanly.
 */
export function getShippingAddress(order) {
  const addr = order?.shipping_address;
  if (!addr) return null;

  return {
    name: `${addr.first_name} ${addr.last_name}`.trim(),
    address1: addr.address1 || "",
    address2: addr.address2 || "",
    city: addr.city || "",
    state: addr.province || "",
    zip: addr.zip || "",
    country: addr.country || "",
    phone: addr.phone || "",
  };
}

/**
 * getOrderSummaryForUI
 * ---------------------
 * A compact summary used for:
 * - OrderCard
 * - OrdersPanel
 * - ActionsPanel
 */
export function getOrderSummaryForUI(order) {
  if (!order) return null;

  return {
    id: order.id,
    name: order.name, // e.g. "#1234"
    date: order.created_at,
    status: order.fulfillment_status,
    financial: order.financial_status,
    total: Number(order.total_price || 0),
    currency: order.currency || "USD",
    items: getFormattedLineItems(order),
    tracking: getTrackingInfo(order),
  };
}

/**
 * getBasicOrderFields
 * --------------------
 * Minimal set of fields for list view or AI context.
 */
export function getBasicOrderFields(order) {
  return {
    id: order?.id,
    created: order?.created_at,
    total: Number(order?.total_price || 0),
    currency: order?.currency || "USD",
    itemCount: order?.line_items?.length || 0,
    status: order?.fulfillment_status || "unfulfilled",
  };
}
