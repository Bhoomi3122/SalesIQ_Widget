import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * useDashboardData Hook
 * ---------------------
 * The Engine of the Dashboard.
 * Fetches Orders, Profile, and AI Insights in one go.
 */
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [visitor, setVisitor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [aiInsights, setAiInsights] = useState({
    sentiment: { score: 0, label: 'Neutral' },
    suggestions: [],
    recommendations: []
  });

  const [context, setContext] = useState({ chatId: null, email: null });

  // 1. Initialize from URL Query Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('chatId');
    const email = params.get('email');

    if (email) {
      setContext({ chatId, email });
      fetchData(email);
    } else {
      setLoading(false);
      // Optional: Load demo data if no email provided
      // loadDemoData(); 
    }
  }, []);

  // 2. The Fetch Function
  const fetchData = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      // Parallel Execution for Speed
      const [profileData, ordersData, aiData] = await Promise.all([
        api.getCustomerProfile(email),
        api.getOrders(email),
        api.getAiAnalysis(email, "Context from chat...") // Pass dummy or real context
      ]);

      setVisitor(profileData);
      setOrders(ordersData);
      setAiInsights(aiData);

    } catch (err) {
      console.error("Dashboard Data Error:", err);
      setError("Failed to load dashboard data.");
      
      // Fallback: If backend fails, don't show a blank screen. Show empty state.
      setVisitor({ email, name: "Guest", totalSpend: 0 });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Action Handlers (Called by UI)
  
  const refreshDashboard = () => {
    if (context.email) fetchData(context.email);
  };

  return {
    loading,
    error,
    visitor,
    orders,
    aiInsights,
    context,
    refreshDashboard
  };
};