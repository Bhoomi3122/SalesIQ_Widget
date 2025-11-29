import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(null);

/**
 * UIProvider — Earthy Premium UI
 * -------------------------------
 * Centralized UI state manager for:
 * - Global loading overlay
 * - Active modals ("cancel-order", "return-order", "send-message")
 * - Future: toast success messages
 * - Future: global error banner
 */

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  /**
   * modal stores the active modal type:
   * - "cancel-order"
   * - "return-order"
   * - "send-message"
   * - null → none open
   */
  const [modal, setModal] = useState(null);

  /** Open modal */
  const openModal = useCallback((type) => {
    setModal(type);
  }, []);

  /** Close modal */
  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  /** Start global loader */
  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  /** Stop global loader */
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const value = {
    loading,
    modal,
    openModal,
    closeModal,
    startLoading,
    stopLoading,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * useUIContext()
 * --------------
 * Hook to access UI context in any component.
 */
export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUIContext must be used inside UIProvider");
  }
  return ctx;
}
