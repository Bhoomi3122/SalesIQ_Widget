const express = require('express');
const router = express.Router();

const ecommerceManager = require('../services/ecommerceManager');
const aiService = require('../services/aiService');
const recommendationService = require('../services/recommendationService');
const ui = require('../utils/zohoUiBuilder');
const InteractionLog = require('../models/InteractionLog');

/**
 * HELPER: Deep Search for Visitor Data
 * Zoho payloads vary based on context (Detail vs Action).
 * This function hunts for email/chatId recursively.
 */
const extractContext = (payload) => {
    // 1. Try Root Level (Standard Detail Handler)
    let email = payload.visitor?.email;
    let chatId = payload.conversation?.id || payload.conversation_id;

    // 2. Try Context Level (Action Handler)
    if (!email) email = payload.context?.visitor?.email;
    if (!chatId) chatId = payload.context?.conversation_id;

    // 3. Try Data Level (Nested Actions)
    if (!email && payload.data) {
        email = payload.data.visitor?.email || payload.data.context?.visitor?.email;
    }
    if (!chatId && payload.data) {
        chatId = payload.data.conversation?.id || payload.data.conversation_id;
    }

    return {
        email: email || "guest@example.com",
        chatId: chatId || "unknown_chat",
        message: payload.conversation?.message || ""
    };
};

router.post('/zoho-widget', async (req, res) => {
    const startTime = Date.now();
    
    // --- DEBUGGING: Print the FULL structure ---
    // This will show up in your Render/Ngrok logs so you can see exactly 
    // what Zoho is sending.
    console.log("📦 ZOHO RAW PAYLOAD:", JSON.stringify(req.body, null, 2)); 

    // 1. EXTRACT DATA USING SMART HELPER
    const { email, chatId, message } = extractContext(req.body);
    
    // Identify Handler Type
    let handlerType = req.body.handler;
    if (!handlerType) {
        handlerType = req.body.name ? "action" : "detail";
    }

    console.log(`🔔 Webhook Processing: ${handlerType} | Chat: ${chatId} | Visitor: ${email}`);

    try {
        // ============================================================
        // CASE 1: ACTION HANDLER (Button Clicks)
        // ============================================================
        if (handlerType === "action") {
            const actionName = req.body.action?.name || req.body.name;
            const actionData = req.body.action?.data || req.body.data || {};
            
            console.log(`⚡ Executing Action: ${actionName}`);
            const actionResult = await ecommerceManager.executeAction(actionName, actionData);

            await InteractionLog.create({
                chatId,
                operatorEmail: req.body.operator?.email || "unknown",
                actionType: actionName,
                details: { result: actionResult }
            });

            return res.json({
                type: "banner",
                text: actionResult.message || "Action processed",
                status: actionResult.success ? "success" : "failure"
            });
        }

        // ============================================================
        // CASE 2: DETAIL HANDLER (Load UI)
        // ============================================================
        
        // Fetch Data
        const [profile, orders, sentiment, smartReplies, recommendations] = await Promise.all([
            ecommerceManager.getCustomerProfile(email),
            ecommerceManager.getRecentOrders(email),
            aiService.analyzeSentiment(message),
            aiService.generateSmartReplies(message, { email }), 
            recommendationService.getRecommendationsForVisitor(email)
        ]);

        // UI Construction
        const metricSection = ui.buildMetricSection("metrics", "Customer Vitals", [
            { label: "Sentiment", value: `${sentiment.label}` },
            { label: "LTV", value: `$${profile?.ecommerceProfile?.totalSpend || 0}` },
            { label: "Orders", value: `${profile?.ecommerceProfile?.orderCount || 0}` }
        ]);

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
        const orderSection = ui.buildFieldsetSection("last_order", "📦 Last Order Context", orderFields);

        const aiItems = smartReplies.map((reply, index) => ({
            title: `Suggestion #${index + 1}`,
            text: reply, 
            subtext: "Click to copy",
            image_url: "https://cdn-icons-png.flaticon.com/512/4712/4712009.png", 
            actionPayload: { text: reply } 
        }));
        const aiSection = ui.buildListingSection("ai_replies", "✨ AI Suggestions", aiItems);

        const recItems = recommendations.map(prod => ({
            title: prod.title,
            text: prod.reason || "Recommended",
            subtext: prod.price,
            image_url: prod.image,
            actionPayload: { id: prod.productId } 
        }));
        const recSection = ui.buildListingSection("recommendations", "🔥 Recommended Products", recItems);

        // Update with your Live Frontend URL
        const actions = [
            ui.createInvokeButton("🔄 Refresh AI Analysis", "refresh_widget", {}, "primary"),
            ...(orders.length > 0 ? [ui.createInvokeButton("💸 Process Refund", "refund_order", { id: orders[0].id }, "danger")] : []),
            ui.createLinkButton("🚀 Open Full Dashboard", `https://omnicom-frontend.vercel.app/dashboard?chatId=${chatId}`)
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