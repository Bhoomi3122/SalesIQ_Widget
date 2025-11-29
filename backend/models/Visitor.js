const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    // 1. Identity (The Key)
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true // Faster lookups
    },
    name: {
        type: String,
        default: "Guest"
    },
    phone: String, // Useful for SMS notifications (Future feature)

    // 2. E-commerce Profile (Cached Data)
    // We update this whenever a new chat starts
    ecommerceProfile: {
        platform: { 
            type: String, 
            enum: ['shopify', 'woocommerce', 'custom'], 
            default: 'custom' 
        },
        customerId: String,         // ID in Shopify/Woo
        totalSpend: { type: Number, default: 0 },
        currency: { type: String, default: "USD" },
        orderCount: { type: Number, default: 0 },
        lastOrderDate: Date,
        tags: [String]              // e.g. ["VIP", "High Return Rate"]
    },

    // 3. AI Analysis Profile (The "Brain")
    aiProfile: {
        sentimentScore: { type: Number, default: 0 }, // Range: -1.0 to 1.0
        sentimentLabel: { type: String, default: "Neutral" }, // "Positive", "Negative"
        summary: String,            // "User frequently asks about shipping delays"
        recommendedProducts: [{     // Cached recommendations
            productId: String,
            title: String,
            reason: String          // "Because they bought Red Shirt"
        }],
        lastInteraction: Date
    },

    // 4. Session Context
    currentChatId: String           // To link active chats
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Visitor', visitorSchema);