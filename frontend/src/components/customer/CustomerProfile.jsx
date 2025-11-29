import React from 'react';
import { User, Mail, Phone, MapPin, Clock, Star, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/format';

/**
 * CUSTOMER PROFILE SIDEBAR
 * ----------------------------------------------------
 * Persistent view of customer identity and value.
 */
const CustomerProfile = ({ customer }) => {
  if (!customer) return null;

  const { 
    name, 
    email, 
    phone, 
    location, 
    totalSpend, 
    orderCount, 
    lastOrderDate, 
    tags = [] 
  } = customer;

  // Smart Logic: Is this a VIP?
  const isVip = totalSpend > 500 || orderCount > 5;
  const isRisk = tags.includes('High Return Rate');

  return (
    <Card className="customer-profile">
      <style>{`
        .customer-profile {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* AVATAR SECTION */
        .profile-header {
          text-align: center;
          margin-bottom: 8px;
        }
        
        .avatar-circle {
          width: 80px;
          height: 80px;
          background: #e0e7ff; /* Light Indigo */
          color: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 2rem;
          font-weight: 600;
          border: 4px solid var(--bg-body);
          box-shadow: 0 0 0 1px var(--border-color);
        }

        .customer-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .customer-meta {
          font-size: 0.9rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* STATS GRID */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .stat-item {
          text-align: center;
        }
        .stat-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        /* CONTACT LIST */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-main);
        }
        .contact-icon {
          color: var(--text-muted);
          min-width: 20px;
        }

        /* TAGS */
        .tags-section {
          margin-top: auto;
        }
        .tags-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      `}</style>

      {/* Header */}
      <div className="profile-header">
        <div className="avatar-circle">
          {name.charAt(0).toUpperCase()}
        </div>
        <h2 className="customer-name">{name}</h2>
        
        <div className="customer-meta">
          {isVip && (
            <Badge variant="success" icon={<Star size={10} />}>
              VIP Customer
            </Badge>
          )}
          {isRisk && (
            <Badge variant="danger" icon={<AlertTriangle size={10} />}>
              Risk
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{orderCount}</span>
          <span className="stat-label">Orders</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatCurrency(totalSpend)}</span>
          <span className="stat-label">LTV</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="contact-list">
        <div className="contact-item">
          <Mail size={18} className="contact-icon" />
          <span className="truncate" title={email}>{email}</span>
        </div>
        {phone && (
          <div className="contact-item">
            <Phone size={18} className="contact-icon" />
            <span>{phone}</span>
          </div>
        )}
        {location && (
          <div className="contact-item">
            <MapPin size={18} className="contact-icon" />
            <span>{location}</span>
          </div>
        )}
        <div className="contact-item">
          <Clock size={18} className="contact-icon" />
          <span>Last Order: {formatDate(lastOrderDate)}</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="tags-section">
          <span className="tags-label">TAGS</span>
          <div className="tags-container">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

    </Card>
  );
};

export default CustomerProfile;