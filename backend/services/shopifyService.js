const axios = require('axios');

/**
 * SHOPIFY SERVICE (PRODUCTION DEBUG EDITION)
 * ---------------------------------------------------
 * 1. Sanitizes URLs to prevent double slashes (common error).
 * 2. Encodes emails (fixes issues with special chars).
 * 3. Logs detailed API responses to the terminal for debugging.
 */

// Strip trailing slashes from URL to avoid //admin/api errors
const RAW_URL = process.env.SHOPIFY_STORE_URL || "";
const SHOPIFY_URL = RAW_URL.replace(/\/$/, ""); 
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const isLive = () => {
    const hasKeys = SHOPIFY_URL && ACCESS_TOKEN;
    if (!hasKeys) console.warn("⚠️ Shopify Service: Missing .env credentials.");
    return hasKeys;
};

/**
 * 1. GET CUSTOMER ORDERS
 */
const getOrdersByEmail = async (email) => {
    if (!isLive()) return []; 

    console.log(`[Shopify] Looking up email: ${email}`);

    try {
        // Step A: Search for Customer
        // URL Encode the email to handle '+' or special chars safely
        const searchUrl = `${SHOPIFY_URL}/admin/api/2023-10/customers/search.json?query=email:${encodeURIComponent(email)}`;
        
        console.log(`[Shopify] GET ${searchUrl}`); // Debug URL

        const customerSearch = await axios.get(searchUrl, { 
            headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } 
        });

        if (customerSearch.data.customers.length === 0) {
            console.log(`[Shopify] ❌ Customer not found: ${email}`);
            return []; 
        }

        const customerId = customerSearch.data.customers[0].id;
        console.log(`[Shopify] ✅ Found Customer ID: ${customerId}`);

        // Step B: Fetch Orders
        const ordersUrl = `${SHOPIFY_URL}/admin/api/2023-10/customers/${customerId}/orders.json?status=any&limit=3`;
        
        const ordersResponse = await axios.get(ordersUrl, { 
            headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } 
        });
        
        const orders = ordersResponse.data.orders;
        console.log(`[Shopify] 📦 Found ${orders.length} orders.`);

        if (orders.length === 0) return [];

        // Map to Widget Format
        return orders.map(order => ({
            id: order.id,
            name: order.name,
            total: order.total_price,
            currency: order.currency,
            // Prioritize fulfillment status, fallback to financial status
            status: order.fulfillment_status || (order.financial_status === 'paid' ? 'UNFULFILLED' : order.financial_status),
            payment_status: order.financial_status,
            date: order.created_at,
            items: order.line_items.map(item => item.title).join(", ")
        }));

    } catch (error) {
        // Log the specific API error message from Shopify
        const errorMsg = error.response?.data?.errors || error.message;
        console.error(`[Shopify] ❌ API Error:`, JSON.stringify(errorMsg));
        return []; 
    }
};

/**
 * 2. SEARCH PRODUCTS
 */
const searchProducts = async (query) => {
    if (!isLive()) return [];

    try {
        // Fetch products (Limit 5 to keep it fast)
        const productsUrl = `${SHOPIFY_URL}/admin/api/2023-10/products.json?limit=5`;
        
        const response = await axios.get(productsUrl, { 
            headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } 
        });

        const allProducts = response.data.products;
        
        // Client-side filtering is more reliable for simple title matches
        const matches = allProducts.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) || 
            (p.tags && p.tags.includes(query))
        ).slice(0, 3);

        console.log(`[Shopify] 🔍 Found ${matches.length} products for "${query}"`);

        return matches.map(p => ({
            id: p.id,
            title: p.title,
            price: p.variants[0]?.price || "0.00",
            image: p.images[0]?.src || ""
        }));

    } catch (error) {
        console.error(`[Shopify] ❌ Product Search Error:`, error.message);
        return [];
    }
};

module.exports = {
    getOrdersByEmail,
    searchProducts
};