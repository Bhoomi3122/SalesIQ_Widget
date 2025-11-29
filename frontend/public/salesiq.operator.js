/**
 * salesiq-operator.js
 * Clean, production-safe version (NO infinite loops)
 */

(function () {
  const IFRAME_ID = "siqcustomapp";
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 500;
  let retryCount = 0;

  /** Track if visitor was already sent */
  let visitorSentOnce = false;

  /** Get iframe */
  function getIframe() {
    return document.getElementById(IFRAME_ID);
  }

  /** Send message to iframe */
  function postToIframe(eventName, payload = {}) {
    const iframe = getIframe();
    if (!iframe || !iframe.contentWindow) {
      console.warn("[OperatorCopilot] iframe not ready:", eventName);
      return false;
    }

    iframe.contentWindow.postMessage(
      { event: eventName, payload },
      "*"
    );

    return true;
  }

  /** Send visitor data to iframe (ONE TIME ONLY PER CHAT) */
  function sendVisitorDataOnce(data) {
    if (visitorSentOnce) {
      console.log("[OperatorCopilot] Visitor already sent, ignoring duplicate.");
      return;
    }

    visitorSentOnce = true;

    postToIframe("COPILOT_VISITOR_DATA", {
      email: data.email || null,
      name: data.name || null,
      visitorId: data.visitorId || null,
      phone: data.phone || null,
      city: data.city || null,
      country: data.country || null,
      chatId: data.chatId || null,
      sourcePage: data.sourcePage || null,
    });
  }

  /** Handle operator accepting chat */
  function handleChatAccept(session) {
    try {
      const visitor = session?.visitor || {};
      const chat = session?.chat || {};

      const data = {
        visitorId: visitor.id || null,
        email: visitor.email || null,
        name: visitor.name || null,
        phone: visitor.phone || null,
        city: visitor.city || null,
        country: visitor.country || null,
        chatId: chat.id || null,
        sourcePage: visitor.source || null,
      };

      console.log("[OperatorCopilot] Chat accepted → sending visitor once:", data);
      sendVisitorDataOnce(data);

    } catch (err) {
      console.error("[OperatorCopilot] Error in handleChatAccept:", err);
    }
  }

  /** Initialize SalesIQ listeners */
  function initSalesIQListener() {
    const salesiq = window.$zoho?.salesiq;

    if (!salesiq || typeof salesiq.on !== "function") {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(
          `[OperatorCopilot] Waiting for SalesIQ SDK... (${retryCount}/${MAX_RETRIES})`
        );
        return setTimeout(initSalesIQListener, RETRY_DELAY);
      }
      console.error("[OperatorCopilot] SalesIQ SDK failed to initialize.");
      return;
    }

    console.log("[OperatorCopilot] SalesIQ SDK ready.");

    salesiq.on("chatAccepted", (session) => {
      // Reset for new chat session
      visitorSentOnce = false;

      console.log("[OperatorCopilot] chatAccepted:", session);
      handleChatAccept(session);
    });

    // Inform iframe widget is ready
    postToIframe("COPILOT_OPERATOR_WIDGET_READY", {});
  }

  /** Remove request context handler to prevent loops */
  window.addEventListener("message", (ev) => {
    if (ev?.data?.event === "COPILOT_IFRAME_READY") {
      console.log("[OperatorCopilot] Iframe ready — OK (no context request).");
      // ❌ DO NOT request context again (causes infinite loops)
    }
  });

  initSalesIQListener();
})();
