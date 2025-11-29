const express = require('express');
const router = express.Router();

// Import Services
const ecommerceManager = require('../services/ecommerceManager');
const aiService = require('../services/aiService');
const recommendationService = require('../services/recommendationService');

// Import Utilities
const ui = require('../utils/zohoUiBuilder');

// Import Models
const InteractionLog = require('../models/InteractionLog');

// Helper to strip emojis from text for a clean look
const cleanText = (text) => text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

/**
 * ZOHO SALESIQ WEBHOOK HANDLER
 * ----------------------------------------------------------------
 * Professional Edition: Clean UI, No Emojis, Corporate Styling.
 */
router.post('/zoho-widget', async (req, res) => {
    const startTime = Date.now();
    
    // 1. EXTRACT PAYLOAD
    const payload = req.body;
    let handlerType = payload.handler;
    if (!handlerType) {
        handlerType = payload.name ? "action" : "detail";
    }
    
    const visitorEmail = payload.visitor?.email || payload.context?.visitor?.email || "guest@example.com";
    const chatId = payload.conversation?.id || payload.context?.conversation_id || "unknown_chat";
    const messageText = payload.conversation?.message || ""; 

    console.log(`🔔 Webhook: ${handlerType.toUpperCase()} | Chat: ${chatId}`);

    try {
        // ============================================================
        // CASE 1: ACTION HANDLER (Button Clicks)
        // ============================================================
        if (handlerType === "action") {
            const actionName = payload.action?.name || payload.name;
            const actionData = payload.action?.data || payload.data || {};
            
            const actionResult = await ecommerceManager.executeAction(actionName, actionData);

            await InteractionLog.create({
                chatId,
                operatorEmail: payload.operator?.email || "unknown",
                actionType: actionName,
                details: { result: actionResult }
            });

            return res.json({
                type: "banner",
                text: actionResult.message || "Action processed successfully",
                status: actionResult.success ? "success" : "failure"
            });
        }

        // ============================================================
        // CASE 2: DETAIL HANDLER (Load UI)
        // ============================================================
        
        const [profile, orders, sentiment, smartReplies, recommendations] = await Promise.all([
            ecommerceManager.getCustomerProfile(visitorEmail),
            ecommerceManager.getRecentOrders(visitorEmail),
            aiService.analyzeSentiment(messageText),
            aiService.generateSmartReplies(messageText, { email: visitorEmail }), 
            recommendationService.getRecommendationsForVisitor(visitorEmail)
        ]);

        // --- SECTION 1: METRICS ---
        // Clean, High-Level Stats
        const metricSection = ui.buildMetricSection("metrics", "CUSTOMER PROFILE", [
            { label: "Sentiment", value: cleanText(sentiment.label) }, 
            { label: "Lifetime Value", value: `$${profile?.ecommerceProfile?.totalSpend || 0}` },
            { label: "Total Orders", value: `${profile?.ecommerceProfile?.orderCount || 0}` }
        ]);

        // --- SECTION 2: LAST ORDER ---
        let orderFields = [{ label: "Status", value: "No recent orders" }];
        if (orders && orders.length > 0) {
            const last = orders[0];
            orderFields = [
                { label: "Order ID", value: last.name },
                { label: "Date", value: new Date(last.date).toLocaleDateString() },
                { label: "Status", value: (last.status || "Unknown").toUpperCase() }, 
                { label: "Items", value: last.items || "N/A" }
            ];
        }
        const orderSection = ui.buildFieldsetSection("last_order", "MOST RECENT ORDER", orderFields);

        // --- SECTION 3: AI SMART REPLIES ---
        // Professional Icon: A simple 'reply' arrow or 'chat' bubble
        const replyIcon = "https://img.icons8.com/ios-glyphs/60/000000/chat.png";
        
        const aiItems = smartReplies.map((reply, index) => ({
            title: `Reply Option ${index + 1}`,
            text: reply, 
            subtext: "Click to copy to chat",
            image_url: replyIcon,
            actionPayload: { text: reply } 
        }));
        const aiSection = ui.buildListingSection("ai_replies", "SMART REPLIES", aiItems);

        // --- SECTION 4: PRODUCT RECOMMENDATIONS ---
        // Professional Icon: A simple 'tag' or 'product' icon if image fails
        const recItems = recommendations.map(prod => ({
            title: prod.title,
            text: prod.reason || "Based on purchase history",
            subtext: `Price: ${prod.price}`,
            image_url: prod.image || "https://img.icons8.com/ios-glyphs/60/000000/shopping-bag.png",
            actionPayload: { id: prod.productId } 
        }));
        const recSection = ui.buildListingSection("recommendations", "UPSELL RECOMMENDATIONS", recItems);

        // --- SECTION 5: GLOBAL ACTIONS ---
        // Clean Labels
        const actions = [
            ui.createInvokeButton("Refresh Analysis", "refresh_widget", {}, "primary"),
            ...(orders.length > 0 ? [ui.createInvokeButton("Process Refund", "refund_order", { id: orders[0].id }, "danger")] : []),
            // NOTE: Replace URL below with your deployed Frontend URL
            ui.createLinkButton("Open Dashboard", `https://omnicom-frontend.vercel.app/dashboard?chatId=${chatId}`)
        ];
        const actionSection = ui.buildActionsSection("global_actions", actions);

        // Assemble
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
            ui.buildMetricSection("error", "System Status", [{ label: "Backend", value: "Offline" }]),
            ui.buildFieldsetSection("error_details", "Error Log", [{ label: "Message", value: "Service unavailable." }])
        ]));
    }
});

module.exports = router;