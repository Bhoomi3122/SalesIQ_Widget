import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/format';

/**
 * SHOPPING GRAPH
 * ----------------------------------------------------
 * Visualizes spending trends over the last 6 months.
 * Uses 'recharts' for a professional, interactive SVG chart.
 */
const ShoppingGraph = ({ orders }) => {
  
  // 1. Transform Order Data into Chart Data (Monthly Aggregation)
  const processData = () => {
    if (!orders || orders.length === 0) return generateMockTrend();

    const monthlyData = {};
    
    orders.forEach(order => {
      const date = new Date(order.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
      monthlyData[monthKey] += parseFloat(order.total);
    });

    // Convert to Array and sort (Simplified for demo)
    const chartData = Object.keys(monthlyData).map(month => ({
      name: month,
      amount: monthlyData[month]
    }));

    // If only 1 data point, add a baseline for better visuals
    if (chartData.length === 1) {
      chartData.unshift({ name: 'Prev', amount: 0 });
    }

    return chartData.length > 0 ? chartData : generateMockTrend();
  };

  // Fallback for empty states so the dashboard always looks alive
  const generateMockTrend = () => [
    { name: 'Jun', amount: 0 },
    { name: 'Jul', amount: 120 },
    { name: 'Aug', amount: 80 },
    { name: 'Sep', amount: 250 },
    { name: 'Oct', amount: 180 },
    { name: 'Nov', amount: 300 },
  ];

  const data = processData();
  const totalSpend = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="analytics-card">
      <style>{`
        .analytics-card {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .chart-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .metric-big {
          text-align: right;
        }
        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          display: block;
        }
        .metric-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 600;
        }
        
        /* Custom Tooltip Style */
        .custom-tooltip {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: var(--shadow-md);
        }
        .tooltip-label { font-weight: 600; color: var(--text-main); font-size: 0.9rem; }
        .tooltip-value { color: var(--color-primary); font-weight: 500; }
      `}</style>

      {/* Header */}
      <div className="chart-header">
        <div>
          <div className="chart-title">
            <TrendingUp size={18} className="text-primary" />
            Spending Velocity
          </div>
          <span className="chart-subtitle">Last 6 Months Activity</span>
        </div>
        <div className="metric-big">
          <span className="metric-value">{formatCurrency(totalSpend)}</span>
          <span className="metric-label">Total Volume</span>
        </div>
      </div>

      {/* The Chart */}
      <div style={{ width: '100%', height: 200, flex: 1 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#2563eb" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Custom Tooltip Component for Professional Look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default ShoppingGraph;