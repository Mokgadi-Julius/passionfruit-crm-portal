import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import '../styles/Analytics.css';

interface CreditsAnalyticsProps {
  token: string;
}

const CreditsAnalytics: React.FC<CreditsAnalyticsProps> = ({ token }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/crm/analytics/credits', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Credits analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading credits analytics...</div>;
  }

  const summary = data?.summary || {};
  const transactions = data?.recentTransactions || [];
  const creditFlow = data?.creditFlow || [];

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>💰 Credits & Revenue</h1>
        <p>Track credit purchases, usage patterns, and revenue trends across employers</p>
      </header>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            💳
          </div>
          <div className="metric-content">
            <h3>{parseInt(summary.total_credits || 0).toLocaleString()}</h3>
            <p>Total Credits in System</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            🏢
          </div>
          <div className="metric-content">
            <h3>{summary.employers_with_credits || 0}</h3>
            <p>Employers with Credits</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            📊
          </div>
          <div className="metric-content">
            <h3>{Math.round(summary.avg_credits_per_employer || 0)}</h3>
            <p>Avg Credits per Employer</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            👥
          </div>
          <div className="metric-content">
            <h3>{summary.total_employers || 0}</h3>
            <p>Total Employers</p>
          </div>
        </div>
      </div>

      {/* Credit Flow Chart */}
      {creditFlow.length > 0 && (
        <div className="chart-container">
          <h2>Credit Flow (Last 30 Days)</h2>
          <p>Track credit purchases vs usage over time</p>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={creditFlow}>
              <defs>
                <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF9800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Legend />
              <Area type="monotone" dataKey="purchased" stroke="#4CAF50" fillOpacity={1} fill="url(#colorPurchased)" name="Credits Purchased" />
              <Area type="monotone" dataKey="used" stroke="#FF9800" fillOpacity={1} fill="url(#colorUsed)" name="Credits Used" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="data-card">
        <h2>Recent Credit Transactions</h2>
        <div className="data-list">
          {transactions.slice(0, 15).map((transaction: any, index: number) => (
            <div key={index} className="data-item">
              <div className="avatar">
                {transaction.transaction_type === 'purchase' ? '💳' : '📤'}
              </div>
              <div className="info">
                <strong>{transaction.company_name}</strong>
                <small>{transaction.email}</small>
              </div>
              <div className="meta">
                <span className={`badge ${transaction.transaction_type === 'purchase' ? 'success' : 'warning'}`} style={{
                  background: transaction.transaction_type === 'purchase' ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255, 152, 0, 0.25)',
                  color: transaction.transaction_type === 'purchase' ? '#4CAF50' : '#FF9800'
                }}>
                  {transaction.transaction_type === 'purchase' ? '+' : ''}{transaction.amount} credits
                </span>
                <small>{new Date(transaction.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditsAnalytics;
