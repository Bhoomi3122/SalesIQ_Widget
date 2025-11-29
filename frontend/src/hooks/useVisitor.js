import { useEffect, useState, useCallback, useRef } from "react";

/**
 * useVisitor Hook — FIXED FOR REAL PRODUCTION
 * -------------------------------------------
 * - No infinite loops
 * - No repeated visitor updates
 * - No request-context ping-pong
 */

export default function useVisitor() {
  const [visitor, setVisitor] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // Track if visitor was already set → prevents duplicate triggers
  const visitorInitialized = useRef(false);

  /**
   * Post message to parent window (SalesIQ)
   */
  const postToParent = useCallback((eventName, payload = {}) => {
    try {
      window.parent.postMessage({ event: eventName, payload }, "*");
    } catch (err) {
      console.error("[useVisitor] Failed to post message:", err);
    }
  }, []);

  /**
   * Validate visitor payload shape
   */
  const isValidVisitor = (payload) => {
    if (!payload) return false;
    return payload.email || payload.visitorId;
  };

  /**
   * Handle incoming postMessage
   */
  const handleMessage = useCallback(
    (event) => {
      const data = event?.data;
      if (!data || !data.event) return;

      switch (data.event) {
        case "COPILOT_OPERATOR_WIDGET_READY":
          setWidgetReady(true);
          break;

        case "COPILOT_VISITOR_DATA":
          /** Accept visitor ONLY once */
          if (visitorInitialized.current) {
            console.log("[useVisitor] Duplicate visitor ignored");
            return;
          }

          if (isValidVisitor(data.payload)) {
            visitorInitialized.current = true;
            console.log("[useVisitor] Visitor received:", data.payload);
            setVisitor(data.payload);
          }
          break;

        case "COPILOT_REQUEST_CONTEXT":
          /**
           * 🚫 DO NOT send visitor again
           * — this was causing an infinite loop
           */
          console.log(
            "[useVisitor] Widget requested context — ignored (prevents loop)"
          );
          break;

        default:
          break;
      }
    },
    []
  );

  /**
   * Initial handshake only once
   */
  useEffect(() => {
    window.addEventListener("message", handleMessage);

    // Send handshake ONCE
    if (!iframeReady) {
      postToParent("COPILOT_IFRAME_READY");
      setIframeReady(true);
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, iframeReady, postToParent]);

  return {
    visitor,
    visitorReady: !!visitor,
    widgetReady,
    iframeReady,
  };
}
