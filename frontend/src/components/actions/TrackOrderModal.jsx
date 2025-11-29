import React, { useState } from "react";
import { X, Copy, ExternalLink, Truck, MapPin, CheckCircle, Package } from "lucide-react";

/**
 * TRACK ORDER MODAL
 * ----------------------------------------------------
 * Visual tracking timeline and logistics details.
 * Matches 'variables.css' theme.
 */
export default function TrackOrderModal({
  visible,
  order,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  if (!visible || !order) return null;

  // Mock Tracking Data (In real app, this comes from order.tracking_info)
  const trackingNumber = order.tracking_number || "1Z999AA10123456784";
  const carrier = "FedEx Express";
  const eta = "Today, 2:00 PM - 4:00 PM";
  
  // Determine active step based on order status
  const getStepStatus = (stepIndex) => {
    const statusMap = {
      'pending': 0,
      'unfulfilled': 1,
      'fulfilled': 2, // Shipped
      'delivered': 4
    };
    const currentStep = statusMap[order.status?.toLowerCase()] || 2; // Default to shipped for demo
    return stepIndex <= currentStep ? 'active' : 'inactive';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-modal-overlay);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-container {
          background: var(--bg-surface);
          width: 100%;
          max-width: 600px; /* Wider for map/timeline */
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-modal);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        /* HEADER */
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-body);
        }

        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .close-btn:hover { background: #e2e8f0; color: var(--text-main); }

        /* BODY */
        .modal-body { padding: 0; overflow-y: auto; }

        /* MAP PREVIEW (Simulated) */
        .map-container {
          height: 200px;
          background-color: #e5e7eb;
          background-image: url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,13,0/600x200?access_token=YOUR_TOKEN'); 
          /* Fallback pattern if image fails */
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-color);
        }
        
        .map-marker {
          background: var(--color-primary);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 6px;
          animation: bounce 2s infinite;
        }

        /* TRACKING DETAILS */
        .tracking-info {
          padding: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .info-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .copy-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 2px 6px;
        }

        /* TIMELINE */
        .timeline {
          position: relative;
          padding-left: 32px;
          margin-top: 10px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 5px;
          bottom: 5px;
          width: 2px;
          background: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }
        .timeline-item:last-child { margin-bottom: 0; }

        .timeline-dot {
          position: absolute;
          left: -32px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .timeline-item.active .timeline-dot {
          background: var(--color-success);
          border-color: var(--color-success);
          color: white;
        }
        
        .timeline-item.inactive .timeline-dot {
          color: var(--text-muted);
        }

        .timeline-text { font-size: 0.95rem; font-weight: 500; color: var(--text-main); }
        .timeline-time { font-size: 0.8rem; color: var(--text-muted); }

        /* FOOTER */
        .modal-footer {
          padding: 16px 24px;
          background: var(--bg-body);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-secondary { background: white; border: 1px solid var(--border-color); color: var(--text-main); }
        .btn-primary { background: var(--color-primary); color: white; border: none; }
        .btn-primary:hover { background: var(--color-primary-hover); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title"><MapPin size={20} className="text-primary"/> Track Shipment</h3>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            
            {/* Visual Map Placeholder */}
            <div className="map-container">
              <div className="map-marker">
                <Truck size={16} />
                <span>In Transit • New York, NY</span>
              </div>
            </div>

            <div className="tracking-info">
              {/* Details Grid */}
              <div className="info-grid">
                <div>
                  <div className="info-label">Tracking Number</div>
                  <div className="info-value">
                    {trackingNumber}
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? <CheckCircle size={14}/> : <Copy size={14}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="info-label">Carrier</div>
                  <div className="info-value">{carrier}</div>
                </div>
                <div>
                  <div className="info-label">Status</div>
                  <div className="info-value" style={{color: 'var(--color-info)'}}>
                    In Transit
                  </div>
                </div>
                <div>
                  <div className="info-label">Estimated Delivery</div>
                  <div className="info-value">{eta}</div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="timeline">
                
                <div className={`timeline-item ${getStepStatus(0)}`}>
                  <div className="timeline-dot"><Package size={12}/></div>
                  <div className="timeline-content">
                    <div className="timeline-text">Order Placed</div>
                    <div className="timeline-time">Nov 28, 9:00 AM</div>
                  </div>
                </div>

                <div className={`timeline-item ${getStepStatus(1)}`}>
                  <div className="timeline-dot"><Truck size={12}/></div>
                  <div className="timeline-content">
                    <div className="timeline-text">Shipped</div>
                    <div className="timeline-time">Nov 29, 2:30 PM</div>
                  </div>
                </div>

                <div className={`timeline-item ${getStepStatus(2)}`}>
                  <div className="timeline-dot"><MapPin size={12}/></div>
                  <div className="timeline-content">
                    <div className="timeline-text">Out for Delivery</div>
                    <div className="timeline-time">Today (Est.)</div>
                  </div>
                </div>

                <div className={`timeline-item ${getStepStatus(3)}`}>
                  <div className="timeline-dot"><CheckCircle size={12}/></div>
                  <div className="timeline-content">
                    <div className="timeline-text">Delivered</div>
                    <div className="timeline-time">--</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => window.open(order.tracking_url || '#', '_blank')}
            >
              View on Carrier Site <ExternalLink size={16} />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}