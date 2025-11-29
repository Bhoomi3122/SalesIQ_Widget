import React from 'react';
import { CheckCircle, Truck, Package, CreditCard, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { formatDate, formatCurrency } from '../../utils/format';

/**
 * ORDER TIMELINE
 * ----------------------------------------------------
 * Visual progress tracker for order fulfillment.
 * Matches 'variables.css' theme.
 */
const OrderTimeline = ({ order }) => {
  if (!order) return null;

  const { date, status, payment_status, total, currency, items } = order;

  // Determine Timeline State
  const steps = [
    { 
      id: 'placed', 
      label: 'Order Placed', 
      date: date, 
      icon: <Package size={16} />, 
      completed: true 
    },
    { 
      id: 'paid', 
      label: 'Payment', 
      status: payment_status, 
      icon: <CreditCard size={16} />, 
      completed: payment_status === 'paid' 
    },
    { 
      id: 'shipped', 
      label: 'Shipped', 
      status: status === 'fulfilled' ? 'Shipped' : 'Pending', 
      icon: <Truck size={16} />, 
      completed: status === 'fulfilled' 
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      status: 'Est. Delivery', 
      icon: <CheckCircle size={16} />, 
      completed: false // Mock logic for demo
    }
  ];

  // Helper to parse items string if needed
  const itemList = Array.isArray(items) ? items : (items ? items.split(',') : []);

  return (
    <Card className="timeline-card">
      <style>{`
        .timeline-card {
          padding: 24px;
        }

        .timeline-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .timeline-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .timeline-meta {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
        }

        /* TIMELINE CONTAINER */
        .timeline-steps {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .step-item {
          display: flex;
          gap: 16px;
          position: relative;
          padding-bottom: 24px;
        }

        .step-item:last-child {
          padding-bottom: 0;
        }

        /* VERTICAL LINE */
        .step-line {
          position: absolute;
          left: 15px;
          top: 30px;
          bottom: 0;
          width: 2px;
          background: var(--border-color);
          z-index: 1;
        }

        .step-item:last-child .step-line {
          display: none;
        }

        /* ICON CIRCLE */
        .step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          z-index: 2;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        /* COMPLETED STATE */
        .step-item.completed .step-icon {
          background: var(--color-success);
          border-color: var(--color-success);
          color: white;
        }
        
        .step-item.completed .step-line {
          background: var(--color-success); /* Green line for completed path */
        }

        /* CONTENT */
        .step-content {
          flex: 1;
          padding-top: 4px;
        }

        .step-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 2px;
        }

        .step-status {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .step-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: auto;
        }
        
        /* ORDER SUMMARY FOOTER */
        .timeline-footer {
          margin-top: 24px;
          background: var(--bg-body);
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 8px;
          color: var(--text-muted);
        }
        .summary-row.total {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          font-weight: 700;
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 0;
        }
      `}</style>

      <div className="timeline-header">
        <h3 className="timeline-title">Order Progress</h3>
        <div className="timeline-meta">
          <span>{formatDate(date)}</span>
          <span>{items.length || 1} Items</span>
        </div>
      </div>

      <div className="timeline-steps">
        {steps.map((step, index) => (
          <div key={step.id} className={`step-item ${step.completed ? 'completed' : ''}`}>
            <div className="step-line"></div>
            <div className="step-icon">
              {step.completed ? <CheckCircle size={18} /> : step.icon}
            </div>
            <div className="step-content">
              <div style={{display: 'flex'}}>
                <span className="step-label">{step.label}</span>
              </div>
              <span className="step-status">
                {step.id === 'placed' ? 'Confirmed' : (step.status || 'Pending')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-footer">
        {itemList.map((item, idx) => (
          <div key={idx} className="summary-row">
             <span>{typeof item === 'string' ? item : item.title}</span>
             {/* Placeholder quantity if not available in string */}
             <span>x1</span> 
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
    </Card>
  );
};

export default OrderTimeline;