import { createContext, useContext, useEffect, useState } from "react";

const VisitorContext = createContext(null);

/**
 * VisitorProvider
 * ----------------
 * Stores real visitor info sent from the Zoho SalesIQ Operator Widget.
 * NO MOCKS, NO DEV AUTO-INJECTION.
 */
export function VisitorProvider({ children }) {
  const [visitor, setVisitor] = useState(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  // Prevent duplicate visitor initialization
  const [initialized, setInitialized] = useState(false);

  /**
   * Listen for ALL postMessage events from the Operator Widget
   */
  useEffect(() => {
    console.log(
      "%c[VisitorContext] Mounted, listening for postMessage",
      "color: purple"
    );

    const handler = (ev) => {
      const data = ev?.data;
      if (!data) return;

      console.log("[VisitorContext] Message received:", data);

      const eventType = data.type || data.event;

      /** ---------------------------
       *  🔹 Widget announces it's ready
       * ----------------------------
       */
      if (eventType === "COPILOT_OPERATOR_WIDGET_READY") {
        setWidgetReady(true);
        console.log("[VisitorContext] Widget ready");
        return;
      }

      /** ---------------------------
       *  🔹 Iframe announces it's ready
       * ----------------------------
       */
      if (eventType === "COPILOT_IFRAME_READY") {
        setIframeReady(true);
        console.log("[VisitorContext] Iframe ready");
        return;
      }

      /** ---------------------------
       *  🔹 MAIN EVENT: Visitor Data
       *  Handles both:
       *   - { type: "COPILOT_VISITOR_DATA", email, name, visitorId }
       *   - { event: "COPILOT_VISITOR_DATA", payload: {...} }
       * ----------------------------
       */
      if (eventType === "COPILOT_VISITOR_DATA") {
        if (initialized) {
          console.log(
            "[VisitorContext] Ignored duplicate visitor event (already initialized)"
          );
          return;
        }

        const payload = data.payload || data;

        const v = {
          email: payload.email || null,
          name: payload.name || null,
          visitorId: payload.visitorId || null,
          phone: payload.phone || null,
          country: payload.country || null,
          city: payload.city || null,
          chatId: payload.chatId || null,
          sourcePage: payload.sourcePage || null,
        };

        console.log("[VisitorContext] Visitor initialized:", v);
        setVisitor(v);
        setInitialized(true);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [initialized]);

  const value = {
    visitor,
    visitorReady: !!visitor,
    widgetReady,
    iframeReady,
  };

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

/**
 * useVisitorContext()
 * -------------------
 * Returns visitor data
 */
export function useVisitorContext() {
  const ctx = useContext(VisitorContext);
  if (!ctx) {
    throw new Error("useVisitorContext must be used within VisitorProvider");
  }
  return ctx;
}
