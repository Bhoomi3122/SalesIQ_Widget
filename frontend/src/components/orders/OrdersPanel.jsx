import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import OrderCard from './OrderCard';
import CancelOrderModal from '../actions/CancelOrderModal';
import ReturnOrderModal from '../actions/ReturnOrderModal';
import TrackOrderModal from '../actions/TrackOrderModal';
import Loader from '../ui/Loader';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

// NOTE: Ensure this hook exists or replace with direct prop if fetching at Layout level
import { useOrders } from '../../hooks/useOrders'; 

/**
 * ORDERS PANEL
 * ----------------------------------------------------
 * The main list container. 
 * Manages which Modal is open (Cancel/Return/Track).
 */
const OrdersPanel = ({ visitorId }) => {
  // Fetch data (or receive as props)
  const { orders, loading, error, refreshOrders } = useOrders(visitorId);
  
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

  const handleActionConfirm = async (data) => {
    console.log(`Executing ${modalType} on Order #${selectedOrder.name}`, data);
    // In a real app, you'd call an API here: await api.cancelOrder(selectedOrder.id, data.reason);
    
    closeModal();
    refreshOrders(); // Refresh list to show new status
  };

  // RENDER LOGIC
  if (loading) return <div className="panel-loading"><Loader /></div>;
  
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
          message="This customer hasn't placed any orders yet."
        />
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order}
              onCancel={(o) => openModal(o, 'cancel')}
              onReturn={(o) => openModal(o, 'return')}
              onTrack={(o) => openModal(o, 'track')}
            />
          ))}
        </div>
      )}

      {/* --- MODALS --- */}
      
      <CancelOrderModal 
        visible={modalType === 'cancel'} 
        order={selectedOrder} 
        onClose={closeModal} 
        onConfirm={(reason) => handleActionConfirm({ reason })} 
      />

      <ReturnOrderModal 
        visible={modalType === 'return'} 
        order={selectedOrder} 
        onClose={closeModal} 
        onConfirm={(data) => handleActionConfirm(data)} 
      />

      <TrackOrderModal 
        visible={modalType === 'track'} 
        order={selectedOrder} 
        onClose={closeModal} 
      />

    </div>
  );
};

export default OrdersPanel;