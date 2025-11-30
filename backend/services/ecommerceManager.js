const shopifyService = require('./shopifyService');
const Visitor = require('../models/Visitor');
// Helper function to remove leading/trailing whitespace and emojis from user data
const cleanText = (text) => text ? text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim() : '';

/**
 * E-COMMERCE MANAGER (The Universal Adapter)
 * ---------------------------------------------------
 * Fixes: Uses findOneAndUpdate (upsert) to prevent E11000 errors.
 */
const getCustomerProfile = async (email) => {
    if (!email || email === "guest@example.com") {
         // Return a safe placeholder profile if no email is available
        return { email: email, ecommerceProfile: { totalSpend: 0, orderCount: 0, tags: [] } };
    }

    try {
        // Fetch fresh orders first (needed for accurate LTV)
        const shopifyOrders = await shopifyService.getOrdersByEmail(email);
        const totalSpend = shopifyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        
        // Prepare the data to be updated or inserted
        const updateData = {
            $set: {
                email: email,
                name: cleanText(email.split('@')[0]), // Simple name extraction
                ecommerceProfile: {
                    platform: 'shopify',
                    totalSpend: totalSpend,
                    orderCount: shopifyOrders.length,
                    lastOrderDate: shopifyOrders[0]?.date || new Date(),
                    tags: totalSpend > 500 ? ["VIP", "Loyal"] : ["Standard"]
                }
            }
        };

        // CRITICAL FIX: Use findOneAndUpdate with upsert: true
        // This ensures MongoDB either finds the existing document by email 
        // OR creates a new one, avoiding the E11000 duplicate key error.
        const visitor = await Visitor.findOneAndUpdate(
            { email: email }, 
            updateData, 
            { 
                new: true, // Return the updated document
                upsert: true, // Create if it doesn't exist
                setDefaultsOnInsert: true 
            }
        );

        return visitor;

    } catch (error) {
        // We catch the error here, but still return a stable mock object 
        // to prevent the API call chain from breaking.
        console.error("Manager Profile Error [DUPLICATE KEY FIX APPLIED]:", error.message);
        return { email: email, ecommerceProfile: { totalSpend: 0, orderCount: 0, tags: [] } };
    }
};

// --- (Other functions from ecommerceManager.js should follow here) ---

const getRecentOrders = async (email) => {
    // For the Hackathon, we primarily route to Shopify.
    return await shopifyService.getOrdersByEmail(email);
};

const executeAction = async (actionName, payload) => {
    console.log(`🔌 Adapter Executing: ${actionName} for`, payload);
    // This is placeholder logic as these actions are now handled by the frontend Modals
    switch (actionName) {
        case 'refund_order':
        case 'cancel_order':
        case 'return_order':
            return { success: true, message: `${actionName.replace('_', ' ')} command sent.` };
        
        case 'handle_copy_text':
        case 'refresh_widget':
        case 'open_url_action':
            // FIX: This returns success=true which the controller uses to log. 
            // The controller then handles the immediate exit for open_url_action.
            return { success: true, message: `UI action acknowledged.` };

        default:
            return { success: false, message: "Action not supported" };
    }
};

module.exports = {
    getCustomerProfile,
    getRecentOrders,
    executeAction
};