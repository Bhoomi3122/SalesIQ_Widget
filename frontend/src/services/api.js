import axios from "axios";

/**
 * API SERVICE
 * ---------------------------------------------------------
 * Connects React Frontend to Node.js Backend.
 * Base URL: VITE_API_BASE (or localhost:5000)
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // 20s timeout for AI calls
  headers: { "Content-Type": "application/json" },
});

// Request Logger (Dev Mode)
client.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
  }
  return config;
});

export const api = {
  
  // --- 1. CUSTOMER DATA ---
  
  getCustomerProfile: async (email) => {
    try {
      const res = await client.get(`/api/operator/customer/${encodeURIComponent(email)}`);
      return res.data?.customer || null;
    } catch (error) {
      console.warn("Profile fetch failed, returning fallback.");
      return { name: "Guest User", email, totalSpend: 0, orderCount: 0 };
    }
  },

  getOrders: async (email) => {
    try {
      const res = await client.get(`/api/operator/orders/${encodeURIComponent(email)}`);
      return res.data?.orders || [];
    } catch (error) {
      console.warn("Orders fetch failed, returning empty list.");
      return [];
    }
  },

  // --- 2. AI INTELLIGENCE ---

  getAiAnalysis: async (email, contextText) => {
    try {
      const res = await client.post("/api/operator/ai/analyze", { 
        email, 
        context: contextText 
      });
      return res.data || { sentiment: { label: 'Neutral', score: 0 }, suggestions: [], recommendations: [] };
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      return { 
        sentiment: { label: 'Neutral', score: 0 }, 
        suggestions: ["AI Service Unavailable"], 
        recommendations: [] 
      };
    }
  },

  // --- 3. ACTIONS (Modals) ---

  cancelOrder: async (orderId, reason) => {
    const res = await client.post("/api/operator/orders/cancel", { orderId, reason });
    return res.data;
  },

  returnOrder: async (orderId, reason, note) => {
    const res = await client.post("/api/operator/orders/return", { orderId, reason, note });
    return res.data;
  },

  sendProductLink: async (email, productId) => {
    const res = await client.post("/api/operator/products/send-link", { email, productId });
    return res.data;
  }

};

export default api;