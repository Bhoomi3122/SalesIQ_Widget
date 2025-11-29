const shopifyService = require('./shopifyService');
const Visitor = require('../models/Visitor');

/**
 * E-COMMERCE MANAGER (The Universal Adapter)
 * ---------------------------------------------------
 * This layer abstracts the specific platform (Shopify, Woo, Magento).
 * The Controller only talks to THIS file, never directly to Shopify.
 * * Logic:
 * 1. Check if the visitor is stored in our DB.
 * 2. Identify their platform (e.g. "shopify" vs "custom").
 * 3. Route the request to the correct service.
 */

// 1. GET UNIFIED PROFILE
// Returns a standard object regardless of the source platform
const getCustomerProfile = async (email) => {
    try {
        // Step A: Check our Local Cache first
        let visitor = await Visitor.findOne({ email });

        // Step B: If new, try to fetch from Shopify (Default strategy for Hackathon)
        if (!visitor) {
            // In a real app, we'd check multiple APIs here
            const shopifyOrders = await shopifyService.getOrdersByEmail(email);
            
            // Calculate LTV from fresh data
            const totalSpend = shopifyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
            
            // Create new Visitor Record
            visitor = new Visitor({
                email,
                ecommerceProfile: {
                    platform: 'shopify', // Auto-detect for demo
                    totalSpend: totalSpend,
                    orderCount: shopifyOrders.length,
                    lastOrderDate: shopifyOrders[0]?.date || new Date()
                }
            });
            await visitor.save();
        }

        return visitor;

    } catch (error) {
        console.error("Manager Profile Error:", error.message);
        return null;
    }
};

// 2. GET RECENT ORDERS (Normalized)
const getRecentOrders = async (email) => {
    // For the Hackathon, we primarily route to Shopify.
    // To prove "Universal" capabilities, you can simply add:
    // if (email.includes('@local-store.com')) return localPhpService.getOrders(email);
    
    return await shopifyService.getOrdersByEmail(email);
};

// 3. EXECUTE ACTION (Refund, Cancel, etc.)
const executeAction = async (actionName, payload) => {
    console.log(`🔌 Adapter Executing: ${actionName} for`, payload);

    switch (actionName) {
        case 'refund_order':
            // In production: await shopifyService.refundOrder(payload.id);
            return { success: true, message: `Refund processed for Order #${payload.id}` };
        
        case 'send_product_link':
            // Logic to email/chat the link
            return { success: true, message: `Link sent for Product ${payload.id}` };

        default:
            return { success: false, message: "Action not supported on this platform" };
    }
};

module.exports = {
    getCustomerProfile,
    getRecentOrders,
    executeAction
};