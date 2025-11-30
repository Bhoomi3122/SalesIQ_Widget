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
    
    // console.log("📦 ZOHO RAW PAYLOAD:", JSON.stringify(req.body, null, 2)); 

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
            
            console.log(`⚡ Executing Action: ${actionName}`, actionData);

            // --- Log the action before any branching logic that exits the function ---
            // This ensures every click is logged even if the outcome is just opening a URL
            await InteractionLog.create({
                chatId,
                operatorEmail: req.body.operator?.email || "unknown",
                actionType: actionName,
                details: { input: actionData }
            }).catch(e => console.error("Interaction Log Failed:", e.message));

            // 1. URL OPENING ACTION (Highest Priority Exit)
            if (actionName === "open_url_action") {
                // If Zoho receives 200 OK status immediately, it performs the client-side URL opening.
                // This prevents the generic banner from overriding the link action.
                return res.status(200).send({ message: "URL command acknowledged." });
            }

            // 2. TEXT INJECTION ACTION
            else if (actionName === "handle_copy_text") {
                return res.json({
                    type: "post_message",
                    text: actionData.text
                });
            }
            
            // 3. REFRESH WIDGET ACTION
            else if (actionName === "refresh_widget") {
                // Fall through to the Detail Handler to rebuild the UI below (Case 2)
                console.log("🔄 Refreshing Widget Data...");
            }
            
            // 4. DEFAULT FALLBACK (For unknown or placeholder actions)
            else {
                return res.json({
                    type: "banner",
                    text: `Action ${actionName} handled.`,
                    status: "success"
                });
            }
        }

        // ============================================================
        // CASE 2: DETAIL/RELOAD HANDLER (Load/Reload UI)
        // ============================================================
        
        // --- Fetch Intelligence ---
        const [profile, orders, sentiment, smartReplies, recommendations] = await Promise.all([
            ecommerceManager.getCustomerProfile(email),
            ecommerceManager.getRecentOrders(email),
            aiService.analyzeSentiment(message),
            aiService.generateSmartReplies(message, { email }), 
            recommendationService.getRecommendationsForVisitor(email)
        ]);

        const liveOrderCount = orders ? orders.length : 0;
        const liveTotalSpend = orders ? orders.reduce((sum, ord) => sum + parseFloat(ord.total), 0) : 0;

        // --- SECTION 1: METRICS ---
        const metricSection = ui.buildMetricSection("metrics", "CUSTOMER VITALS", [
            { label: "Sentiment", value: cleanText(sentiment.label) },
            { label: "LTV", value: `$${liveTotalSpend.toFixed(2)}` },
            { label: "Total Orders", value: `${liveOrderCount}` }
        ]);

        // --- SECTION 2: ORDER HISTORY ---
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

        // --- SECTION 3: AI SUGGESTIONS ---
        const replyIcon = "https://img.icons8.com/ios-glyphs/60/000000/chat.png";
        const aiItems = smartReplies.map((reply, index) => ({
            title: `Suggestion ${index + 1}`,
            text: reply, 
            subtext: "Click to insert",
            image_url: replyIcon,
            actionPayload: { text: reply } 
        }));
        
        aiItems.forEach(item => {
            if(item.action) item.action.name = "handle_copy_text";
        });

        const aiSection = ui.buildListingSection("ai_replies", "AI SMART REPLIES", aiItems);

        // --- SECTION 4: RECOMMENDATIONS ---
        const allPurchasedItems = orders.map(o => o.items).join(", ").toLowerCase();
        
        let filteredRecs = recommendations.filter(prod => 
            !allPurchasedItems.includes(prod.title.toLowerCase())
        );

        if (filteredRecs.length === 0) {
            if (allPurchasedItems.includes("shirt") || allPurchasedItems.includes("hoodie")) {
                filteredRecs.push({ productId: "fallback_jeans", title: "Classic Denim Jeans", price: "49.99", image: "https://img.icons8.com/ios-glyphs/60/000000/jeans.png", reason: "Completes the look" });
            } else if (allPurchasedItems.includes("jeans") || allPurchasedItems.includes("pants")) {
                 filteredRecs.push({ productId: "fallback_tee", title: "Cotton Crew Tee", price: "25.00", image: "https://img.icons8.com/ios-glyphs/60/000000/t-shirt.png", reason: "Matches your pants" });
            } else {
                 filteredRecs.push({ productId: "fallback_trending", title: "Trending Accessories", price: "15.00", image: "https://img.icons8.com/ios-glyphs/60/000000/star.png", reason: "Popular with customers like you" });
            }
        }

        const recItems = filteredRecs.slice(0, 3).map(prod => ({
            title: prod.title,
            text: prod.reason || "Recommended",
            subtext: `Price: ${prod.price}`,
            image_url: prod.image || "https://img.icons8.com/ios-glyphs/60/000000/shopping-bag.png",
            actionPayload: { text: `Check out ${prod.title}: ${prod.image || ''}` } 
        }));
        
        recItems.forEach(item => {
            if(item.action) item.action.name = "handle_copy_text";
        });

        const recSection = ui.buildListingSection("recommendations", "UPSELL OPPORTUNITIES", recItems);

        // --- SECTION 5: ACTIONS ---
        const actions = [
            ui.createInvokeButton("Refresh Analysis", "refresh_widget", {}, "primary"),
            ui.createLinkButton("Open Full Dashboard", `https://sales-iq-widget.vercel.app/dashboard?chatId=${chatId}&email=${email}`)
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