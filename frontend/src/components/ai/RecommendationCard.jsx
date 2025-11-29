import React from "react";

/**
 * RecommendationCard
 * -------------------
 * Shows a single product recommendation from AI.
 *
 * Props:
 * - product: { title, price, currency, image, url, description }
 * - onSelect()  → triggered when operator clicks card
 */

export default function RecommendationCard({ product, onSelect }) {
  if (!product) return null;

  const {
    title,
    price,
    currency = "USD",
    image,
    url,
    description,
  } = product;

  return (
    <div
      className="rec-card fade-in"
      onClick={onSelect}
      style={{
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        transition: "all var(--transition-medium)",
        boxShadow: "var(--shadow-xs)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-xs)";
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "6px",
          background: "var(--color-surface-alt)",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "No Image"
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "3px",
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title || "Untitled Product"}
        </div>

        {/* Description (optional) */}
        {description && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "5px",
              lineHeight: "16px",
            }}
          >
            {description.length > 70
              ? description.substring(0, 70) + "..."
              : description}
          </div>
        )}

        {/* Price + Link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--text-primary)",
            }}
          >
            {currency} {price}
          </div>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                color: "var(--color-primary)",
                textDecoration: "underline",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
