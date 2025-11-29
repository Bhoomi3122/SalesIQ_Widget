const axios = require('axios');

/**
 * AI SERVICE (Groq / Llama 3)
 * ---------------------------------------------------
 * Handles Sentiment Analysis and Smart Reply Generation.
 * Includes a robust Fallback mechanism for Hackathon stability.
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Helper: Check if AI is configured
const isAiEnabled = () => GROQ_API_KEY && GROQ_API_KEY.length > 5;

/**
 * 1. ANALYZE SENTIMENT
 * Returns: { score: 0.8, label: "Positive" }
 */
const analyzeSentiment = async (text) => {
    if (!text || !isAiEnabled()) return getMockSentiment(text);

    try {
        const response = await axios.post(
            GROQ_URL,
            {
                model: "llama3-8b-8192", // Fast & Free model on Groq
                messages: [
                    {
                        role: "system",
                        content: "Analyze the sentiment of the following customer message. Return ONLY a JSON object with 'score' (-1 to 1) and 'label' (Positive, Neutral, Negative)."
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            },
            { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
        );

        const result = JSON.parse(response.data.choices[0].message.content);
        return {
            score: result.score || 0,
            label: result.label || "Neutral"
        };

    } catch (error) {
        console.error("AI Sentiment Error:", error.message);
        return getMockSentiment(text);
    }
};

/**
 * 2. GENERATE SMART REPLIES
 * Uses context (e.g. Order Status) to generate helpful answers.
 */
const generateSmartReplies = async (text, orderContext) => {
    if (!text || !isAiEnabled()) return getMockReplies(text, orderContext);

    try {
        const systemPrompt = `
            You are a helpful E-commerce Support Agent.
            Context: Customer's last order status is: ${JSON.stringify(orderContext)}.
            Task: Generate 3 short, professional reply suggestions for the operator to send.
            Format: Return ONLY a JSON object with a key 'replies' containing an array of 3 strings.
        `;

        const response = await axios.post(
            GROQ_URL,
            {
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            },
            { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
        );

        const result = JSON.parse(response.data.choices[0].message.content);
        return result.replies || getMockReplies(text);

    } catch (error) {
        console.error("AI Reply Error:", error.message);
        return getMockReplies(text, orderContext);
    }
};

/**
 * 3. FALLBACKS (The Safety Net)
 * Ensures the UI always has data, even if AI is down.
 */
const getMockSentiment = (text = "") => {
    const lower = text.toLowerCase();
    if (lower.includes("angry") || lower.includes("late") || lower.includes("bad")) {
        return { score: -0.8, label: "😠 Negative" };
    }
    if (lower.includes("love") || lower.includes("great") || lower.includes("thanks")) {
        return { score: 0.9, label: "😊 Positive" };
    }
    return { score: 0, label: "😐 Neutral" };
};

const getMockReplies = (text, orderContext) => {
    // Basic rule-based suggestions
    if (orderContext && orderContext.status === "unfulfilled") {
        return [
            "I can check the status of your shipment right now.",
            "It looks like your order is being packed.",
            "Would you like me to expedite this for you?"
        ];
    }
    return [
        "Hello! How can I help you with your order today?",
        "Could you please confirm your order number?",
        "I can certainly help you with that request."
    ];
};

module.exports = {
    analyzeSentiment,
    generateSmartReplies
};