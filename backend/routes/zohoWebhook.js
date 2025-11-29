const express = require('express');
const router = express.Router();

const ecommerceManager = require('../services/ecommerceManager');
const aiService = require('../services/aiService');
const recommendationService = require('../services/recommendationService');
const ui = require('../utils/zohoUiBuilder');
const InteractionLog = require('../models/InteractionLog');

// HELPER: Strip emojis for a clean, corporate look
const cleanText = (text) => {
    if (!text) return "";
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
};

/**
 * HELPER: Deep Search for Visitor Data
 */
const extractContext = (payload) => {
    let email = payload.visitor?.email;
    let chatId = payload.conversation?.id || payload.conversation_id;

    if (!email) email = payload.context?.visitor?.email;
    if (!chatId) chatId = payload.context?.conversation_id;

    if (!email && payload.data) {
        email = payload.data.visitor?.email || payload.data.context?.visitor?.email;
    }
    if (!chatId && payload.data) {
        chatId = payload.data.conversation?.id || payload.data.conversation_id;
    }

    if (!email && payload.context?.data) {
        email = payload.context.data.email_id || payload.context.data.email;
    }

    return {
        email: email || "guest@example.com",
        chatId: chatId || "unknown_chat",
        message: payload.conversation?.message || ""
    };
};

router.post('/zoho-widget', async (req, res) => {
    const startTime = Date.now();
    
    // Debugging Log
    console.log("📦 ZOHO RAW PAYLOAD:", JSON.stringify(req.body, null, 2)); 

    const { email, chatId, message } = extractContext(req.body);
    
    let handlerType = req.body.handler;
    if (!handlerType) {
        handlerType = req.body.name ? "action" : "detail";
    }

    console.log(`🔔 Webhook Processing: ${handlerType} | Chat: ${chatId} | Visitor: ${email}`);

    try {
        // ============================================================
        // CASE 1: ACTION HANDLER
        // ============================================================
        if (handlerType === "action") {
            const actionName = req.body.action?.name || req.body.name;
            const actionData = req.body.action?.data || req.body.data || {};
            
            console.log(`⚡ Executing Action: ${actionName}`);

            // SPECIAL CASE: "Refresh" should NOT return a banner. 
            // It should fall through to CASE 2 to re-render the widget.
            if (actionName === "refresh_widget") {
                console.log("🔄 Refreshing Widget Data...");
                // Do nothing here, let code flow down to "DETAIL HANDLER" logic
            } 
            // SPECIAL CASE: "Copy Text" (AI Suggestion)
            else if (actionName === "handle_copy_text") {
                return res.json({
                    type: "post_message",
                    value: actionData.text // This puts text into operator's chat bar
                });
            }
            // STANDARD ACTIONS (Refund, Cancel)
            else {
                const actionResult = await ecommerceManager.executeAction(actionName, actionData);

                // Log action asynchronously
                InteractionLog.create({
                    chatId,
                    operatorEmail: req.body.operator?.email || "unknown",
                    actionType: actionName,
                    details: { result: actionResult }
                }).catch(err => console.error("Log Error:", err.message));

                return res.json({
                    type: "banner",
                    text: actionResult.message || "Action processed",
                    status: actionResult.success ? "success" : "failure"
                });
            }
        }

        // ============================================================
        // CASE 2: DETAIL HANDLER (Load/Reload UI)
        // ============================================================
        
        const [profile, orders, sentiment, smartReplies, recommendations] = await Promise.all([
            ecommerceManager.getCustomerProfile(email),
            ecommerceManager.getRecentOrders(email),
            aiService.analyzeSentiment(message),
            aiService.generateSmartReplies(message, { email }), 
            recommendationService.getRecommendationsForVisitor(email)
        ]);

        // --- CALCULATION METRICS ---
        const liveOrderCount = orders ? orders.length : 0;
        const liveTotalSpend = orders ? orders.reduce((sum, ord) => sum + parseFloat(ord.total), 0) : 0;

        // --- SECTION 1: METRICS ---
        const metricSection = ui.buildMetricSection("metrics", "CUSTOMER PROFILE", [
            { label: "Sentiment", value: cleanText(sentiment.label) },
            { label: "Lifetime Value", value: `$${liveTotalSpend.toFixed(2)}` },
            { label: "Total Orders", value: `${liveOrderCount}` }
        ]);

        // --- SECTION 2: ORDER HISTORY (LISTING) ---
        // Changed from Fieldset to Listing to show multiple orders
        const orderItems = orders.map(order => ({
            title: `Order ${order.name}`,
            text: `${order.date.substring(0, 10)} - ${order.status.toUpperCase()}`,
            subtext: order.items || "No items",
            image_url: "https://img.icons8.com/ios-glyphs/60/000000/box.png",
            actionPayload: { 
                // In a full app, this would open order details. 
                // For now, it copies ID to clipboard or just acts as a visual item.
                text: `Order ID: ${order.name}` 
            }
        }));
        
        const orderSection = ui.buildListingSection(
            "order_history", 
            "RECENT ORDERS", 
            orderItems.length > 0 ? orderItems : [{ title: "No Orders", text: "Customer has no history", subtext: "" }]
        );

        // --- SECTION 3: AI SUGGESTIONS ---
        const replyIcon = "https://img.icons8.com/ios-glyphs/60/000000/chat.png";
        const aiItems = smartReplies.map((reply, index) => ({
            title: `Suggestion ${index + 1}`,
            text: reply, 
            subtext: "Click to insert",
            image_url: replyIcon,
            // Uses 'handle_copy_text' action we handled above
            actionPayload: { text: reply } 
        }));
        // We override the action name in the builder manually for this specific section if needed,
        // or ensure zohoUiBuilder maps 'handle_list_click' to our 'handle_copy_text' logic.
        // *Hack*: We'll just catch 'handle_list_click' as a copy action if the payload has 'text'.
        
        // Let's actually patch the action name dynamically:
        aiItems.forEach(item => {
            if(item.action) item.action.name = "handle_copy_text";
        });

        const aiSection = ui.buildListingSection("ai_replies", "AI SMART REPLIES", aiItems);

        // --- SECTION 4: RECOMMENDATIONS ---
        // Filter: Don't show products user just bought (simple check against last order items)
        const lastOrderItems = orders.length > 0 ? orders[0].items.toLowerCase() : "";
        
        const filteredRecs = recommendations.filter(prod => 
            !lastOrderItems.includes(prod.title.toLowerCase())
        );

        const recItems = filteredRecs.map(prod => ({
            title: prod.title,
            text: prod.reason || "Recommended",
            subtext: `Price: ${prod.price}`,
            image_url: prod.image || "https://img.icons8.com/ios-glyphs/60/000000/shopping-bag.png",
            actionPayload: { id: prod.productId } 
        }));
        const recSection = ui.buildListingSection("recommendations", "UPSELL OPPORTUNITIES", recItems);

        // --- SECTION 5: ACTIONS ---
        // Added "Cancel/Return" buttons for the LATEST order
        const actions = [
            ui.createInvokeButton("Refresh Analysis", "refresh_widget", {}, "primary"),
            
            ...(orders.length > 0 ? [
                ui.createInvokeButton("Cancel Latest Order", "cancel_order", { id: orders[0].id }, "danger"),
                ui.createInvokeButton("Return Latest Order", "return_order", { id: orders[0].id }, "default")
            ] : []),

            ui.createLinkButton("Open Full Dashboard", `https://omnicom-frontend.vercel.app/dashboard?chatId=${chatId}`)
        ];
        const actionSection = ui.buildActionsSection("global_actions", actions);

        const finalResponse = ui.buildWidgetResponse([
            metricSection,
            orderSection,
            aiSection,
            recSection,
            actionSection
        ]);

        console.log(`✅ Widget Loaded in ${Date.now() - startTime}ms`);
        res.json(finalResponse);

    } catch (error) {
        console.error("❌ Widget Error:", error);
        res.json(ui.buildWidgetResponse([
            ui.buildMetricSection("error", "System Alert", [{ label: "Status", value: "Error" }]),
            ui.buildFieldsetSection("error_details", "Debug Info", [{ label: "Message", value: "Check server logs." }])
        ]));
    }
});

module.exports = router;