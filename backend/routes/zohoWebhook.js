const express = require('express');
const router = express.Router();

const ecommerceManager = require('../services/ecommerceManager');
const aiService = require('../services/aiService');
const recommendationService = require('../services/recommendationService');
const ui = require('../utils/zohoUiBuilder');
const InteractionLog = require('../models/InteractionLog');

// =======================
// CLEAN TEXT HELPER
// =======================
const cleanText = (text) => {
    if (!text) return "";
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
};

// =======================
// CONTEXT EXTRACTOR
// =======================
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

// ============================================================
// MAIN WIDGET ENTRY
// ============================================================
router.post('/zoho-widget', async (req, res) => {
    const startTime = Date.now();

    console.log("📦 FULL RAW ZOHO PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    const { email, chatId, message } = extractContext(req.body);

    let handlerType = req.body.handler;
    if (!handlerType) handlerType = req.body.name ? "action" : "detail";

    console.log(`🔔 Webhook Processing: ${handlerType} | Chat: ${chatId} | Visitor: ${email}`);

    try {

        // ============================================================
        // CASE 1: ACTION HANDLER
        // ============================================================
        if (handlerType === "action") {

            console.log("\n============================");
            console.log("🔥 ACTION HANDLER TRIGGERED");
            console.log("============================\n");

            const actionName = req.body.action?.name || req.body.name;
            const actionData = req.body.action?.data || req.body.data || {};

            console.log("🎯 ACTION NAME:", actionName);
            console.log("📦 ACTION DATA:", JSON.stringify(actionData, null, 2));

            // Log in DB
            await InteractionLog.create({
                chatId,
                operatorEmail: req.body.operator?.email || "unknown",
                actionType: actionName,
                details: { input: actionData }
            }).catch(err => console.error("⚠️ Interaction Log Failed:", err.message));

            // ============================================================
            // 🔥 OPEN URL ACTION (THIS IS THE BUTTON YOU CARE ABOUT)
            // ============================================================
            if (actionName === "open_url_action") {

                console.log("\n🚨 open_url_action DETECTED");
                console.log("🔍 Raw action data:", actionData);

                const urlFromZoho = actionData?.url;
                const fallbackUrl = `https://sales-iq-widget.vercel.app/dashboard?chatId=${chatId}&email=${email}`;
                const finalUrl = urlFromZoho || fallbackUrl;

                console.log("🌐 URL FROM ZOHO:", urlFromZoho);
                console.log("🌐 FALLBACK URL:", fallbackUrl);
                console.log("🌐 FINAL URL TO SEND:", finalUrl);

                const payload = {
                    type: "open_url",
                    url: finalUrl
                };

                console.log("📤 SENDING RESPONSE:", payload);

                return res.json(payload);
            }

            // ============================================================
            // TEXT INJECTION
            // ============================================================
            if (actionName === "handle_copy_text") {
                console.log("✍ TEXT INJECTION:", actionData.text);
                return res.json({
                    type: "post_message",
                    text: actionData.text
                });
            }

            // ============================================================
            // REFRESH HANDLER
            // ============================================================
            if (actionName === "refresh_widget") {
                console.log("🔄 REFRESH WIDGET TRIGGERED");
            }

            // ============================================================
            // DEFAULT FALLBACK
            // ============================================================
            console.log("ℹ️ UNKNOWN ACTION - sending banner");
            return res.json({
                type: "banner",
                text: `Action ${actionName} handled.`,
                status: "success"
            });
        }

        // ============================================================
        // CASE 2: DETAIL / INITIAL LOAD
        // ============================================================
        console.log("📥 Loading visitor dashboard UI...");

        const [profile, orders, sentiment, smartReplies, recommendations] = await Promise.all([
            ecommerceManager.getCustomerProfile(email),
            ecommerceManager.getRecentOrders(email),
            aiService.analyzeSentiment(message),
            aiService.generateSmartReplies(message, { email }),
            recommendationService.getRecommendationsForVisitor(email)
        ]);

        console.log("📊 Loaded customer insights.");

        const liveOrderCount = orders ? orders.length : 0;
        const liveTotalSpend = orders ? orders.reduce((sum, ord) => sum + parseFloat(ord.total), 0) : 0;

        const metricSection = ui.buildMetricSection("metrics", "CUSTOMER VITALS", [
            { label: "Sentiment", value: cleanText(sentiment.label) },
            { label: "LTV", value: `$${liveTotalSpend.toFixed(2)}` },
            { label: "Total Orders", value: `${liveOrderCount}` }
        ]);

        const orderItems = orders.map(order => ({
            title: `Order ${order.name}`,
            text: `${order.date.substring(0, 10)} | ${order.status.toUpperCase()}`,
            subtext: order.items || "No items",
            image_url: "https://img.icons8.com/ios-glyphs/60/000000/box.png",
            actionPayload: { text: `Order ID: ${order.name}` }
        }));

        const orderSection = ui.buildListingSection(
            "order_history",
            "RECENT ORDER HISTORY",
            orderItems.length > 0 ? orderItems : [{ title: "No Orders", text: "Customer has no history", subtext: "" }]
        );

        const replyIcon = "https://img.icons8.com/ios-glyphs/60/000000/chat.png";
        const aiItems = smartReplies.map((reply, index) => ({
            title: `Suggestion ${index + 1}`,
            text: reply,
            subtext: "Click to insert",
            image_url: replyIcon,
            actionPayload: { text: reply }
        }));

        const aiSection = ui.buildListingSection("ai_replies", "AI SMART REPLIES", aiItems);

        const allPurchasedItems = orders.map(o => o.items).join(", ").toLowerCase();
        let filteredRecs = recommendations.filter(prod =>
            !allPurchasedItems.includes(prod.title.toLowerCase())
        );

        const recItems = filteredRecs.slice(0, 3).map(prod => ({
            title: prod.title,
            text: prod.reason || "Recommended",
            subtext: `Price: ${prod.price}`,
            image_url: prod.image || "https://img.icons8.com/ios-glyphs/60/000000/shopping-bag.png",
            actionPayload: { text: `Check out ${prod.title}: ${prod.image || ''}` }
        }));

        const recSection = ui.buildListingSection("recommendations", "UPSELL OPPORTUNITIES", recItems);

        const actions = [
            ui.createInvokeButton("Refresh Analysis", "refresh_widget", {}, "primary"),
            ui.createLinkButton(
                "Open Full Dashboard",
                `https://sales-iq-widget.vercel.app/dashboard?chatId=${chatId}&email=${email}`
            )
        ];

        const actionSection = ui.buildActionsSection("global_actions", actions);

        const finalResponse = ui.buildWidgetResponse([
            metricSection,
            orderSection,
            aiSection,
            recSection,
            actionSection
        ]);

        console.log(`✅ Widget UI Built in ${Date.now() - startTime}ms`);
        return res.json(finalResponse);

    } catch (err) {
        console.error("❌ Widget Error:", err);
        return res.json(ui.buildWidgetResponse([
            ui.buildMetricSection("error", "System Alert", [{ label: "Status", value: "Error" }]),
            ui.buildFieldsetSection("error_details", "Debug Info", [{ label: "Message", value: "Check server logs." }])
        ]));
    }
});

module.exports = router;
