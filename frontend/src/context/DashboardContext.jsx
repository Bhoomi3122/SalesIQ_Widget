import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create the Context
const DashboardContext = createContext();

/**
 * DASHBOARD PROVIDER
 * ----------------------------------------------------
 * Manages global state for the entire Operator Dashboard.
 * - Fetches initial data based on URL params (chatId, email).
 * - Provides helper functions to refresh data.
 */
export const DashboardProvider = ({ children }) => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data Objects
  const [visitor, setVisitor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [aiInsights, setAiInsights] = useState({ 
    sentiment: { score: 0, label: 'Neutral' }, 
    suggestions: [], 
    recommendations: [] 
  });

  // Context from URL (Chat ID / Email)
  const [context, setContext] = useState({ chatId: null, email: null });

  // 1. Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('chatId');
    const email = params.get('email');

    if (chatId || email) {
      setContext({ chatId, email });
      fetchDashboardData(email);
    } else {
      setLoading(false); // No context provided
    }
  }, []);

  // 2. Fetch All Data (Parallel)
  const fetchDashboardData = async (email) => {
    if (!email) return;
    
    setLoading(true);
    setError(null);

    try {
      // In a real app, you might have a dedicated /dashboard-data endpoint
      // Here we simulate parallel fetching using your existing services structure
      
      // A. Fetch Customer Profile & Orders
      const profilePromise = api.getCustomerProfile(email);
      const ordersPromise = api.getOrders(email);
      
      // B. Fetch AI Insights (Sentiment, Replies, Recs)
      // Note: In a real scenario, you might pass the last message here
      const aiPromise = api.getAiAnalysis(email, "Latest conversation context..."); 

      const [profileData, ordersData, aiData] = await Promise.all([
        profilePromise,
        ordersPromise,
        aiPromise
      ]);

      setVisitor(profileData);
      setOrders(ordersData);
      setAiInsights(aiData);

    } catch (err) {
      console.error("Dashboard Data Error:", err);
      setError("Failed to load dashboard data. Please try refreshing.");
      // Fallback Mock Data for Demo Stability
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // 3. Refresh Function (Exposed to Components)
  const refreshData = () => {
    if (context.email) fetchDashboardData(context.email);
  };

  // Fallback Mock Data (Safety Net)
  const loadMockData = () => {
    setVisitor({ name: "Guest User", email: context.email || "guest@example.com", totalSpend: 0, orderCount: 0 });
    setOrders([]);
    setAiInsights({ 
      sentiment: { score: 0, label: 'Neutral' }, 
      suggestions: ["Welcome! How can I help?"], 
      recommendations: [] 
    });
  };

  // Value Object exposed to consumers
  const value = {
    loading,
    error,
    visitor,
    orders,
    aiInsights,
    context,
    refreshData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Custom Hook to use the Context
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default DashboardContext;