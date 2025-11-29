/**
 * ---------------------------------------------------------
 * API SERVICE — PRODUCTION READY (NO MOCKS)
 * ---------------------------------------------------------
 * Connected to real backend endpoints:
 *
 *  GET  /api/operator/customer/:email
 *  GET  /api/operator/orders/:email
 *
 *  POST /api/operator/cancel
 *  POST /api/operator/return
 *
 *  POST /api/operator/ai/reply
 *  POST /api/operator/send-reply
 *
 * ---------------------------------------------------------
 */

import axios from "axios";

// Use environment variable OR fallback to local server
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------
 * LOGGING (DEV ONLY)
 * ------------------------------------------------------- */
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(
      "%c[API →]",
      "color:#2a9d8f",
      config.method?.toUpperCase(),
      config.url,
      config.data || ""
    );
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log("%c[API ←]", "color:#264653", res.data);
    }
    return res;
  },
  (err) => {
    console.error("[API] ERROR:", err?.response || err);
    return Promise.reject(err);
  }
);

/* -------------------------------------------------------
 * API FUNCTIONS (REAL)
 * ------------------------------------------------------- */

/**
 * CUSTOMER PROFILE
 */
export async function getCustomerProfile(email) {
  const res = await api.get(`/api/operator/customer/${email}`);
  return res.data?.customer || null;
}

/**
 * ORDERS BY EMAIL
 */
export async function getOrdersByEmail(email) {
  const res = await api.get(`/api/operator/orders/${email}`);
  return res.data?.orders || [];
}

/**
 * CANCEL ORDER
 * payload: { email, orderNumber }
 */
export async function cancelOrder(payload) {
  const res = await api.post("/api/operator/cancel", payload);
  return res.data;
}

/**
 * RETURN ORDER
 * payload: { email, orderNumber }
 */
export async function createReturn(payload) {
  const res = await api.post("/api/operator/return", payload);
  return res.data;
}

/**
 * AI SMART REPLY
 * payload: { message, context: { email } }
 */
export async function getAISmartReplies(payload) {
  const res = await api.post("/api/operator/ai/reply", payload);
  return res.data?.data || [];
}

/**
 * LEGACY COMPATIBILITY
 * getAIRecommendations → maps to getAISmartReplies
 */
export async function getAIRecommendations(payload) {
  return getAISmartReplies(payload);
}

/**
 * SEND MESSAGE TO VISITOR
 * payload: { visitorId, message }
 */
export async function sendMessageToVisitor(payload) {
  const res = await api.post("/api/operator/send-reply", payload);
  return res.data;
}

/**
 * DEFAULT EXPORT
 */
export default api;
