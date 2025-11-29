const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    // Link to the Visitor involved
    visitorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Visitor',
        required: false // Might be null if visitor isn't in DB yet
    },

    // Zoho Context
    chatId: { 
        type: String, 
        required: true,
        index: true 
    }, 
    
    operatorEmail: {
        type: String,
        required: true
    },
    
    // What happened?
    actionType: { 
        type: String, 
        enum: [
            'WIDGET_LOAD',          // When widget first opens
            'REFRESH_AI',           // Operator clicked refresh
            'CLICK_SUGGESTION',     // Operator copied an AI reply
            'CLICK_PRODUCT_LINK',   // Operator sent a product link
            'CLICK_REFUND',         // Operator initiated refund
            'OPEN_DASHBOARD'        // Operator opened full React app
        ],
        required: true 
    },
    
    // Extra Metadata (e.g. "Refunded Order #1022", "Product ID: 555")
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('InteractionLog', interactionSchema);