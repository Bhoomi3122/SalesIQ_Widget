import { useState, useCallback } from "react";
import {
  getAISmartReplies,
  getAIRecommendations,
} from "../services/api";
import { useUIContext } from "../context/UIContext";

/**
 * useAI Hook
 * ----------
 * Provides:
 * - getReplySuggestions(context)
 * - getRecommendations(context)
 *
 * Automatically handles:
 * - global loading overlay
 * - local error handling
 * - mock mode (DEV)
 */

export default function useAI() {
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useUIContext();

  /**
   * Fetch AI reply suggestions (mock-safe)
   */
  const getReplySuggestions = useCallback(
    async (context) => {
      try {
        setError(null);
        startLoading();

        const result = await getAISmartReplies(context);
        setSuggestions(result || []);

        return result;
      } catch (err) {
        console.error("[useAI] Error fetching reply suggestions", err);
        setError("Unable to load AI suggestions.");
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  /**
   * Fetch AI product recommendations (mock-safe)
   */
  const getRecommendations = useCallback(
    async (context) => {
      try {
        setError(null);
        startLoading();

        const items = await getAIRecommendations(context);
        setRecommendations(items || []);

        return items;
      } catch (err) {
        console.error("[useAI] Error fetching recommendations", err);
        setError("Unable to load product recommendations.");
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    // AI data
    suggestions,
    recommendations,

    // AI actions
    getReplySuggestions,
    getRecommendations,

    // error
    error,
  };
}
