import React from 'react';
import { Package, RefreshCw, XCircle, MapPin, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

/**
 * SMART ORDER CARD
 * ----------------------------------------------------
 * Handles business logic for button eligibility:
 * - Cancel: Only if NOT shipped.
 * - Return: Only if Shipped/Delivered.
 * - Track: Only if Tracking Info exists.
 */
const OrderCard = ({ order, onCancel, onReturn, onTrack }) => {
  if (!order) return null;

  const { 
    id, 
    name, 
    date, 
    total, 
    currency,
    status, 
    payment_status, 
    items, // Assuming items is a string or array of objects
    tracking_url 
  } = order;

  // --- BUSINESS LOGIC HELPERS ---
  const statusLower = (status || "").toLowerCase();
  const isShipped = statusLower === 'fulfilled' || statusLower === 'shipped';
  const isCancelled = statusLower === 'cancelled';
  const isReturnable = isShipped && !isCancelled; 
  const isCancellable = !isShipped && !isCancelled;

  // Status Badge Logic
  const getStatusVariant = (s) => {
    if (s === 'fulfilled' || s === 'delivered') return 'success';
    if (s === 'unfulfilled' || s === 'pending') return 'warning';
    if (s === 'cancelled') return 'danger';
    return 'neutral';
  };

  // Item parsing (Handle both string and array)
  const itemList = Array.isArray(items) ? items : (items ? items.split(',') : []);

  return (
    <>
      <style>{`
        .order-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .order-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }

        /* HEADER */
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .order-id {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        /* ITEMS AREA */
        .order-items {
          background: var(--bg-body);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-main);
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .item-row:last-child { margin-bottom: 0; }
        
        .more-items {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-style: italic;
        }

        /* FOOTER ACTIONS */
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .order-total {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .action-group {
          display: flex;
          gap: 8px;
        }
        
        .cancelled-tag {
          color: var(--color-danger);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <div className="order-card">
        {/* Header */}
        <div className="order-header">
          <div>
            <div className="order-id">
              <Package size={18} className="text-muted"/> 
              Order {name}
            </div>
            <span className="order-date">{formatDate(date)}</span>
          </div>
          <Badge variant={getStatusVariant(statusLower)}>
            {status?.toUpperCase() || "UNKNOWN"}
          </Badge>
        </div>

        {/* Items */}
        <div className="order-items">
          {itemList.slice(0, 2).map((item, idx) => (
            <div key={idx} className="item-row">
              <span>{typeof item === 'string' ? item : item.title}</span>
            </div>
          ))}
          {itemList.length > 2 && (
            <div className="more-items">+{itemList.length - 2} more items...</div>
          )}
          {itemList.length === 0 && <span className="text-muted">No items details</span>}
        </div>

        {/* Footer & Actions */}
        <div className="order-footer">
          <div className="order-total">
            {formatCurrency(total, currency)}
          </div>

          <div className="action-group">
            
            {/* TRACK BUTTON (Only if Shipped) */}
            {isShipped && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onTrack(order)}
                title={!tracking_url ? "No tracking info" : "Track Shipment"}
              >
                <MapPin size={14} /> Track
              </Button>
            )}

            {/* RETURN BUTTON (Only if Shipped/Delivered) */}
            {isReturnable && (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => onReturn(order)}
              >
                <RefreshCw size={14} /> Return
              </Button>
            )}

            {/* CANCEL BUTTON (Only if Unfulfilled) */}
            {isCancellable && (
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => onCancel(order)}
              >
                <XCircle size={14} /> Cancel
              </Button>
            )}

            {/* CANCELLED STATE */}
            {isCancelled && (
              <span className="cancelled-tag">
                <AlertCircle size={14} /> Cancelled
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCard;