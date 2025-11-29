import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Check, TrendingUp, ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/format';

/**
 * AI ASSISTANT PANEL
 * ----------------------------------------------------
 * Unified Intelligence: Smart Replies + Product Upsells.
 * Features: Sentiment Analysis bar & One-click actions.
 */
const AiAssistant = ({ sentiment, suggestions, recommendations }) => {
  const [activeTab, setActiveTab] = useState('replies'); // 'replies' | 'upsell'
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Sentiment Logic
  const getSentimentColor = (score) => {
    if (score > 0.3) return 'var(--color-success)';
    if (score < -0.3) return 'var(--color-danger)';
    return 'var(--color-warning)';
  };
  
  const sentimentColor = getSentimentColor(sentiment?.score || 0);

  return (
    <Card className="ai-panel">
      <style>{`
        .ai-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        /* HEADER */
        .ai-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-body);
        }

        .ai-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        /* SENTIMENT BAR */
        .sentiment-container {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .sentiment-track {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .sentiment-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        /* TABS */
        .ai-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
        }
        .tab-btn {
          flex: 1;
          padding: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tab-btn:hover { background: var(--bg-body); color: var(--text-main); }
        .tab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        /* CONTENT LIST */
        .ai-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        /* REPLY ITEM */
        .reply-item {
          background: var(--bg-body);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid transparent;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .reply-item:hover {
          border-color: var(--color-primary);
          background: #eff6ff; /* Light blue tint */
        }
        .reply-text {
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.5;
          padding-right: 24px;
        }
        .copy-icon {
          position: absolute;
          top: 12px;
          right: 12px;
          color: var(--text-muted);
          opacity: 0.6;
        }
        .reply-item:hover .copy-icon { opacity: 1; color: var(--color-primary); }

        /* PRODUCT ITEM */
        .product-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid var(--border-color);
          align-items: center;
        }
        .product-item:last-child { border-bottom: none; }
        
        .product-img {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          background: #f1f5f9;
        }
        .product-info { flex: 1; }
        .product-name { font-size: 0.9rem; font-weight: 600; color: var(--text-main); display: block;}
        .product-reason { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;}
        
        .action-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
        }
      `}</style>

      {/* Header with Sentiment */}
      <div className="ai-header">
        <div className="ai-title">
          <Sparkles size={18} className="text-warning" fill="currentColor" />
          <span>AI Intelligence</span>
        </div>
        <div className="sentiment-container">
          <span>Sentiment:</span>
          <div className="sentiment-track">
            <div 
              className="sentiment-fill" 
              style={{
                width: `${(Math.abs(sentiment?.score || 0) * 100)}%`,
                backgroundColor: sentimentColor
              }}
            />
          </div>
          <span style={{color: sentimentColor, fontWeight: 600}}>
            {sentiment?.label || 'Neutral'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="ai-tabs">
        <button 
          className={`tab-btn ${activeTab === 'replies' ? 'active' : ''}`}
          onClick={() => setActiveTab('replies')}
        >
          <MessageSquare size={16} /> Smart Replies
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upsell' ? 'active' : ''}`}
          onClick={() => setActiveTab('upsell')}
        >
          <TrendingUp size={16} /> Upsell
        </button>
      </div>

      {/* Content Area */}
      <div className="ai-content">
        
        {/* REPLIES TAB */}
        {activeTab === 'replies' && (
          <div className="replies-list">
            {suggestions.map((reply, idx) => (
              <div 
                key={idx} 
                className="reply-item"
                onClick={() => handleCopy(reply, idx)}
                title="Click to copy"
              >
                <p className="reply-text">"{reply}"</p>
                <div className="copy-icon">
                  {copiedId === idx ? <Check size={14} /> : <Copy size={14} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UPSELL TAB */}
        {activeTab === 'upsell' && (
          <div className="products-list">
            {recommendations.map((prod) => (
              <div key={prod.id} className="product-item">
                <img 
                  src={prod.image || "https://via.placeholder.com/50"} 
                  alt={prod.title} 
                  className="product-img"
                />
                <div className="product-info">
                  <span className="product-name">{prod.title}</span>
                  <span className="product-reason">
                    <Sparkles size={10} /> {prod.reason || "Recommended"}
                  </span>
                  <span className="product-price font-bold text-primary">
                    {formatCurrency(prod.price)}
                  </span>
                </div>
                <Button 
                  size="xs" 
                  variant="outline"
                  onClick={() => handleCopy(`${prod.title} - Check it out here: ${prod.url || '#'}`, prod.id)}
                >
                  {copiedId === prod.id ? "Sent" : "Send"}
                </Button>
              </div>
            ))}
          </div>
        )}

      </div>
    </Card>
  );
};

export default AiAssistant;