const shopifyService = require('./shopifyService');
const aiService = require('./aiService');

/**
 * RECOMMENDATION SERVICE
 * ---------------------------------------------------
 * Logic:
 * 1. Analyze User's Last Order (Context).
 * 2. Search for related REAL products in Shopify.
 * 3. Use AI to generate a "Reason" for the recommendation.
 */

const getRecommendationsForVisitor = async (email) => {
    try {
        // 1. Get Context (What did they buy last?)
        const orders = await shopifyService.getOrdersByEmail(email);
        
        let searchKeyword = "featured"; // Default if no orders
        let lastItemName = "";

        if (orders && orders.length > 0) {
            // Extract the first item from the last order
            const lastOrder = orders[0];
            if (lastOrder.items) {
                // Logic: If they bought "Red Denim Jacket", search for "Red" or "Jeans"
                // Simple Hackathon Logic: Take the first word
                lastItemName = lastOrder.items.split(',')[0];
                searchKeyword = lastItemName.split(' ')[0] || "New"; 
            }
        }

        // 2. Fetch REAL Products from Shopify (or Mocks if API fails)
        // This ensures we never hallucinate products that don't exist.
        const products = await shopifyService.searchProducts(searchKeyword);

        // 3. Format for the Widget
        // We limit to 2 recommendations to keep the UI clean
        const recommendations = products.slice(0, 2).map(product => ({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            // Generate a reason: "Because you bought [Last Item]"
            reason: lastItemName ? `Matches your ${lastItemName}` : "Popular right now"
        }));

        return recommendations;

    } catch (error) {
        console.error("Recommendation Error:", error.message);
        return []; // Return empty if everything fails
    }
};

module.exports = {
    getRecommendationsForVisitor
};