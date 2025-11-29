import { useState, useEffect, useCallback } from "react";
import { sortByDate } from "../utils/helpers";
import { useUIContext } from "../context/UIContext";
import { getOrdersByEmail } from "../services/api";

/**
 * useOrders Hook — PRODUCTION VERSION
 * -----------------------------------
 * Fetches real Shopify orders from backend.
 * No mock data, no DEV mode checks.
 */

export default function useOrders(visitor) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const { startLoading, stopLoading } = useUIContext();

  /**
   * Fetch orders from backend
   */
  const fetchOrders = useCallback(async () => {
    if (!visitor || !visitor.email) {
      setOrders([]);
      return;
    }

    try {
      setError(null);
      startLoading();

      const email = visitor.email.trim();
      const result = await getOrdersByEmail(email);

      const sorted = sortByDate(result || []);
      setOrders(sorted);
    } catch (err) {
      console.error("[useOrders] Failed to fetch orders:", err);
      setError("Unable to load order history.");
    } finally {
      stopLoading();
    }
  }, [visitor, startLoading, stopLoading]);

  /**
   * Refresh handler
   */
  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Fetch orders on visitor change
   */
  useEffect(() => {
    if (visitor?.email) {
      fetchOrders();
    } else {
      setOrders([]);
      setError(null);
    }
  }, [visitor, fetchOrders]);

  return {
    orders,
    error,
    refreshOrders,
  };
}
