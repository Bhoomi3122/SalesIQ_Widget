const express = require("express");
const router = express.Router();

const ecommerceManager = require("../services/ecommerceManager");
const aiService = require("../services/aiService");
const recommendationService = require("../services/recommendationService");
const ui = require("../utils/zohoUiBuilder");
const InteractionLog = require("../models/InteractionLog");

// =======================
// CLEAN TEXT HELPER
// =======================
const cleanText = (text) => {
    if (!text) return "";
    return text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
    ).trim();
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
        email = payload.data.visitor?.email || payload.data?.context?.visitor?.email;
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
router.post("/zoho-widget", async (req, res) => {
    const startTime = Date.now();

    console.log("📦 FULL RAW ZOHO PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    const { email, chatId, message } = extractContext(req.body);
    const handlerType = req.body.handler || (req.body.action ? "action" : "detail");

    console.log(
        `🔔 Webhook Processing: ${handlerType} | Chat: ${chatId} | Visitor: ${email}`
    );

    try {
        // ============================================================
        // CASE 1 — ACTION HANDLER
        // ============================================================
        if (handlerType === "action") {
            console.log("\n============================");
            console.log("🔥 ACTION HANDLER TRIGGERED");
            console.log("============================\n");

            const actionId = req.body.action?.id;
            const actionData = req.body.action?.data || {};

            console.log("🎯 ACTION ID:", actionId);
            console.log("📦 ACTION DATA:", JSON.stringify(actionData, null, 2));

            await InteractionLog.create({
                chatId,
                operatorEmail: req.body.operator?.email || "unknown",
                actionType: actionId,
                details: { input: actionData }
            }).catch((err) =>
                console.error("⚠️ Interaction Log Failed:", err.message)
            );

            // ============================================================
            // 🔥 OPEN URL BUTTON HANDLER
            // (from createLinkButton → id = "open_dashboard")
            // ============================================================
            if (actionId === "open_dashboard") {
                console.log("\n🚨 open_dashboard BUTTON CLICKED");
                console.log("🔍 Raw action data:", actionData);

                const url = actionData.web; // correct Zoho field
                const fallback = `https://sales-iq-widget.vercel.app/dashboard?chatId=${chatId}&email=${email}`;

                const finalUrl = url || fallback;

                console.log("🌐 URL FROM ZOHO:", url);
                console.log("🌐 USING FINAL URL:", finalUrl);

                return res.json({
                    type: "open_url",
                    url: finalUrl
                });
            }

            // ============================================================
            // SMART REPLY — COPY TEXT
            // ID = "handle_copy_text"
            // ============================================================
            if (actionId === "handle_copy_text") {
                const replyText = actionData.payload?.text;
                console.log("✍ SMART REPLY CLICKED:", replyText);

                return res.json({
                    type: "post_message",
                    text: replyText
                });
            }

            // ============================================================
            // REFRESH BUTTON HANDLER
            // ============================================================
            if (actionId === "refresh_widget") {
                console.log("🔄 Refresh widget triggered");
            }

            console.log("ℹ️ Unknown action, returning banner");
            return res.json({
                type: "banner",
                status: "success",
                text: `Action ${actionId} handled.`
            });
        }

        // ============================================================
        // CASE 2 — UI RENDER
        // ============================================================
        console.log("📥 Loading visitor dashboard UI...");

        const [profile, orders, sentiment, smartReplies, recommendations] =
            await Promise.all([
                ecommerceManager.getCustomerProfile(email),
                ecommerceManager.getRecentOrders(email),
                aiService.analyzeSentiment(message),
                aiService.generateSmartReplies(message, { email }),
                recommendationService.getRecommendationsForVisitor(email)
            ]);

        console.log("📊 Loaded customer insights.");

        const liveOrderCount = orders?.length || 0;
        const totalSpend = orders
            ? orders.reduce((sum, o) => sum + parseFloat(o.total), 0)
            : 0;

        const metricSection = ui.buildMetricSection("metrics", "CUSTOMER VITALS", [
            { label: "Sentiment", value: cleanText(sentiment.label) },
            { label: "LTV", value: `$${totalSpend.toFixed(2)}` },
            { label: "Total Orders", value: `${liveOrderCount}` }
        ]);

        const orderSection = ui.buildListingSection(
            "order_history",
            "RECENT ORDER HISTORY",
            orders?.map((o) => ({
                title: `Order ${o.name}`,
                text: `${o.date.substring(0, 10)} | ${o.status.toUpperCase()}`,
                subtext: o.items || "",
                image_url: "https://img.icons8.com/ios-glyphs/60/000000/box.png",
                actionPayload: { text: `Order ID: ${o.name}` }
            })) || []
        );

        const aiSection = ui.buildListingSection(
            "ai_replies",
            "AI SMART REPLIES",
            smartReplies.map((text) => ({
                title: "AI Suggestion",
                text,
                image_url:
                    "https://img.icons8.com/ios-glyphs/60/000000/chat.png",
                actionPayload: { text }
            }))
        );

        const recSection = ui.buildListingSection(
            "recommendations",
            "UPSELL OPPORTUNITIES",
            recommendations.map((prod) => ({
                title: prod.title,
                text: prod.reason || "Recommended",
                subtext: `Price: ${prod.price}`,
                image_url: prod.image,
                actionPayload: { text: `Check ${prod.title}` }
            }))
        );

        const actions = [
            ui.createInvokeButton("Refresh Analysis", "refresh_widget", {}),
            ui.createLinkButton(
                "Open Full Dashboard",
                `https://sales-iq-widget.vercel.app/dashboard?chatId=${chatId}&email=${email}`
            )
        ];

        const actionSection = ui.buildActionsSection(
            "global_actions",
            actions
        );

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
        return res.json(
            ui.buildWidgetResponse([
                ui.buildMetricSection("error", "System Error", [
                    { label: "Status", value: "Error" }
                ]),
                ui.buildFieldsetSection("error_details", "Debug Info", [
                    { label: "Message", value: err.message || "Unknown error" }
                ])
            ])
        );
    }
});

module.exports = router;
