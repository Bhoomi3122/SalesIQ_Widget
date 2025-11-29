const axios = require('axios');

/**
 * SHOPIFY SERVICE
 * ---------------------------------------------------
 * Handles all interactions with the Shopify Admin API.
 * Includes a "Safety Net" that returns mock data if API keys are missing.
 */

const SHOPIFY_URL = process.env.SHOPIFY_STORE_URL; // e.g., "https://your-store.myshopify.com"
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Helper to check if we are in "Live Mode"
const isLive = () => SHOPIFY_URL && ACCESS_TOKEN;

/**
 * 1. GET CUSTOMER ORDERS
 * Fetches the last 3 orders for a given email.
 */
const getOrdersByEmail = async (email) => {
    if (!isLive()) return getMockOrders(email);

    try {
        // Step A: Search for Customer ID by Email
        const customerSearch = await axios.get(
            `${SHOPIFY_URL}/admin/api/2023-10/customers/search.json?query=email:${email}`,
            { headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } }
        );

        if (customerSearch.data.customers.length === 0) {
            return []; // Customer not found
        }

        const customerId = customerSearch.data.customers[0].id;

        // Step B: Fetch Orders for that Customer
        const orders = await axios.get(
            `${SHOPIFY_URL}/admin/api/2023-10/customers/${customerId}/orders.json?status=any&limit=3`,
            { headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } }
        );

        return orders.data.orders.map(order => ({
            id: order.id,
            name: order.name, // e.g. "#1001"
            total: order.total_price,
            currency: order.currency,
            status: order.fulfillment_status || "unfulfilled",
            payment_status: order.financial_status,
            date: order.created_at,
            tracking_url: order.fulfillments?.[0]?.tracking_url || null,
            items: order.line_items.map(item => item.title).join(", ")
        }));

    } catch (error) {
        console.error("Shopify API Error:", error.message);
        return getMockOrders(email); // Fallback on error
    }
};

/**
 * 2. SEARCH PRODUCTS (For Recommendations)
 * Finds products matching a keyword (e.g., "red shirt").
 */
const searchProducts = async (query) => {
    if (!isLive()) return getMockProducts(query);

    try {
        const response = await axios.get(
            `${SHOPIFY_URL}/admin/api/2023-10/products.json`,
            { headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } }
        );

        // Simple client-side filter (Shopify search API is complex for hackathon)
        const allProducts = response.data.products;
        const matches = allProducts.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);

        return matches.map(p => ({
            id: p.id,
            title: p.title,
            price: p.variants[0]?.price || "0.00",
            image: p.images[0]?.src || ""
        }));

    } catch (error) {
        console.error("Shopify Product Search Error:", error.message);
        return getMockProducts(query);
    }
};

/**
 * 3. MOCK DATA GENERATORS (The Safety Net)
 * Used when API keys are missing or API fails.
 */
const getMockOrders = (email) => {
    console.log(`⚠️ Using MOCK Shopify Data for: ${email}`);
    return [
        {
            id: "mock_101",
            name: "#1023",
            total: "125.00",
            currency: "USD",
            status: "fulfilled",
            payment_status: "paid",
            date: new Date().toISOString(),
            tracking_url: "https://fedex.com/track/123",
            items: "Blue Denim Jacket, White Tee"
        }
    ];
};

const getMockProducts = (query) => {
    return [
        {
            id: "mock_p1",
            title: `Premium ${query} Item`,
            price: "45.00",
            image: "https://via.placeholder.com/150"
        },
        {
            id: "mock_p2",
            title: `${query} Accessory`,
            price: "15.00",
            image: "https://via.placeholder.com/150"
        }
    ];
};

module.exports = {
    getOrdersByEmail,
    searchProducts
};