const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    // Link to the Visitor involved (Optional for initial logs)
    visitorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Visitor',
        required: false
    },

    // Zoho Context
    chatId: { 
        type: String, 
        required: true,
        index: true 
    }, 
    
    // CRITICAL FIX: Ensure operator email is required and stored
    operatorEmail: {
        type: String,
        required: true
    },
    
    // What happened?
    actionType: { 
        type: String, 
        // CORRECTED ENUM LIST: Matches the names used in routes/zohoWebhook.js
        enum: [
            'WIDGET_LOAD',          
            'refresh_widget',       // Used for Refresh Analysis button
            'refund_order',         // Used for Process Refund button
            'return_order',         // Used for Return Latest Order button
            'cancel_order',         // Added this if we use it later
            'handle_copy_text',     // Used for AI Suggestions / Product Links
            'open_url_action',      // FIX: Used for "Open Full Dashboard" Link Button
            'CLICK_ACTION',         // Fallback for general button clicks
            'LOG_MESSAGE_SENT'      // If logging messages sent by operator
        ],
        required: true 
    },
    
    // Extra Metadata (e.g. { orderId: 1023, reason: "late" })
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('InteractionLog', interactionSchema);