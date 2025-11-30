import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import OrderCard from './OrderCard';
import CancelOrderModal from '../actions/CancelOrderModal';
import ReturnOrderModal from '../actions/ReturnOrderModal';
import TrackOrderModal from '../actions/TrackOrderModal';
import Loader from '../ui/Loader';
import EmptyState from '../EmptyState'; // Corrected Path
import Button from '../ui/Button';

// NOTE: No local data fetching hook is needed here! Data comes from props.

/**
 * ORDERS PANEL
 * ----------------------------------------------------
 * The main list container. 
 * Manages which Modal is open (Cancel/Return/Track) and receives data via props.
 */
const OrdersPanel = ({ orders, loading, error, refreshOrders, onCancel, onReturn, onTrack }) => {
  // Modal State: Store the *entire order object* being acted upon
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'cancel' | 'return' | 'track'

  // HANDLERS
  const openModal = (order, type) => {
    setSelectedOrder(order);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
  };

  // This function is now mostly controlled by App.jsx, but we keep the logic structure.
  const handleActionClick = (order, type) => {
    // These calls map the OrderCard buttons to the Modal state
    if (type === 'cancel') onCancel(order);
    if (type === 'return') onReturn(order);
    if (type === 'track') onTrack(order);
  };
  
  // RENDER LOGIC
  if (loading) return <div className="panel-loading"><Loader text="Loading Orders..." /></div>;
  
  if (error) return (
    <div className="panel-error">
      <p>Unable to load orders.</p>
      <Button size="sm" onClick={refreshOrders}>Retry</Button>
    </div>
  );

  return (
    <div className="orders-panel">
      <style>{`
        .orders-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .panel-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-count {
          background: var(--bg-surface);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
          padding-bottom: 24px;
        }

        .panel-loading, .panel-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--text-muted);
          gap: 12px;
        }
      `}</style>

      {/* Header */}
      <div className="panel-header">
        <div className="panel-title">
          Recent Orders
          {orders && orders.length > 0 && (
            <span className="order-count">{orders.length}</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={refreshOrders}>
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* Content */}
      {!orders || orders.length === 0 ? (
        <EmptyState 
          title="No Orders Found" 
          subtitle="This customer hasn't placed any orders yet." // Fixed prop name to subtitle
        />
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order}
              // Pass event handlers up to App.jsx to open the shared modals
              onCancel={() => handleActionClick(order, 'cancel')}
              onReturn={() => handleActionClick(order, 'return')}
              onTrack={() => handleActionClick(order, 'track')}
            />
          ))}
        </div>
      )}
      
      {/* Modals are handled by the parent App.jsx, but we keep the placeholders 
          to avoid errors if they are conditionally imported. (Cleanest practice is to 
          remove them here but App.jsx requires them for routing).
          We remove the modal rendering logic here entirely since it's in App.jsx.
          
      */}

    </div>
  );
};

export default OrdersPanel;