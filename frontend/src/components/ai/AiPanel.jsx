import React, { useEffect, useState } from "react";
import useAI from "../../hooks/useAI";
import EmptyState from "../EmptyState";
import ReplySuggestion from "./ReplySuggestion";
import RecommendationCard from "./RecommendationCard";

export default function AiPanel({
  visitor,
  orders = [],
  chatMessages = [],
  onSendSuggestion,
}) {
  const {
    suggestions,
    recommendations,
    getReplySuggestions,
    getRecommendations,
    error,
  } = useAI();

  const [latestOrder] = orders || [];

  /** ------------------------------------------------------
   * RUN AI ON VISITOR + LATEST MESSAGE + ORDER CONTEXT
   * Backend expects:
   *  POST /api/operator/ai/reply
   *  Body: { message: "...", context: { email } }
   *
   * Recommendations are optional (not part of required backend)
   * ------------------------------------------------------ */
  useEffect(() => {
    if (!visitor?.email) return;

    const lastMessage = chatMessages?.[chatMessages.length - 1]?.text || "";

    getReplySuggestions({
      message: lastMessage,
      context: { email: visitor.email },
    });

    getRecommendations({
      visitor,
      intent: lastMessage,
    });
  }, [visitor, chatMessages, latestOrder]);

  return (
    <>
      <style>{`
        .ai-panel-container {
          padding: 18px;
          height: 100%;
          overflow-y: auto;
          animation: fadeIn 0.35s ease-out;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        .ai-panel-header {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .ai-panel-error {
          background: var(--status-danger-bg);
          color: var(--status-danger);
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          border: 1px solid var(--status-danger-border);
          margin-bottom: 14px;
        }

        .ai-panel-section {
          margin-bottom: 18px;
        }

        .ai-panel-section-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ai-panel-suggestions-list,
        .ai-panel-recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-panel-divider {
          height: 1px;
          margin: 16px 0;
          background: linear-gradient(
            90deg,
            transparent,
            var(--border-light),
            transparent
          );
          opacity: 0.6;
        }

        .ai-panel-container::-webkit-scrollbar {
          width: 6px;
        }
        .ai-panel-container::-webkit-scrollbar-thumb {
          background: var(--border-light);
          border-radius: 3px;
        }
      `}</style>

      <div className="ai-panel-container fade-in">
        {/* Header */}
        <div className="ai-panel-header">AI Copilot</div>

        {/* Error */}
        {error && <div className="ai-panel-error">{error}</div>}

        {/* No visitor */}
        {!visitor?.email && (
          <EmptyState
            title="No Visitor Selected"
            subtitle="Accept a chat to load AI assistance."
          />
        )}

        {/* AI Content */}
        {visitor?.email && (
          <>
            {/* Suggestions */}
            <div className="ai-panel-section">
              <h3 className="ai-panel-section-title">Suggested Replies</h3>

              {(!suggestions || suggestions.length === 0) && (
                <EmptyState
                  title="No Suggestions Yet"
                  subtitle="AI is analyzing customer context."
                />
              )}

              <div className="ai-panel-suggestions-list">
                {suggestions.map((s, idx) => (
                  <ReplySuggestion
                    key={idx}
                    text={s}
                    onSelect={() => onSendSuggestion(s)}
                  />
                ))}
              </div>
            </div>

            <div className="ai-panel-divider"></div>

            {/* Recommendations (Optional) */}
            <div className="ai-panel-section">
              <h3 className="ai-panel-section-title">Product Recommendations</h3>

              {(!recommendations || recommendations.length === 0) && (
                <EmptyState
                  title="No Recommendations"
                  subtitle="AI found no matching products."
                />
              )}

              <div className="ai-panel-recommendations-list">
                {recommendations.map((item, idx) => (
                  <RecommendationCard
                    key={idx}
                    product={item}
                    onSelect={() =>
                      onSendSuggestion(`Recommended: ${item.title}`)
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
