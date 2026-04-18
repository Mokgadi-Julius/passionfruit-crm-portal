import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import '../styles/Analytics.css';

interface UserEngagementAnalyticsProps {
  token: string;
}

const UserEngagementAnalytics: React.FC<UserEngagementAnalyticsProps> = ({ token }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/crm/analytics/engagement', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Engagement analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user engagement analytics...</div>;
  }

  const activeUsers = data?.activeUsers || {};
  const retention = data?.retention || {};
  const activity = data?.activityMetrics || {};
  const growthData = data?.growthData || [];

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>📈 User Engagement</h1>
        <p>Monitor user activity, login patterns, and platform engagement metrics</p>
      </header>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            ✅
          </div>
          <div className="metric-content">
            <h3>{(parseInt(activeUsers.active_job_seekers || 0) + parseInt(activeUsers.active_employers || 0)).toLocaleString()}</h3>
            <p>Active Users (30d)</p>
            <div className="metric-breakdown">
              <span>{activeUsers.active_job_seekers || 0} Job Seekers</span>
              <span>{activeUsers.active_employers || 0} Employers</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            🆕
          </div>
          <div className="metric-content">
            <h3>{parseInt(activity.new_last_30_days || 0).toLocaleString()}</h3>
            <p>New Users (30d)</p>
            <div className="metric-breakdown">
              <span className="success">+{activity.new_last_7_days || 0} this week</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            🔄
          </div>
          <div className="metric-content">
            <h3>{retention.retention_rate || 0}%</h3>
            <p>Retention Rate</p>
            <div className="metric-breakdown">
              <span>{retention.retained_users || 0} of {retention.cohort_size || 0} users</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            👥
          </div>
          <div className="metric-content">
            <h3>{parseInt(activity.total_users || 0).toLocaleString()}</h3>
            <p>Total Job Seekers</p>
            <div className="metric-breakdown">
              <span>{activity.active_last_7_days || 0} active this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      {growthData.length > 0 && (
        <div className="chart-container">
          <h2>User Growth Trend (Last 60 Days)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorJobSeekers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4E04D" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F4E04D" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="job_seekers" stroke="#2196F3" fillOpacity={1} fill="url(#colorJobSeekers)" name="Job Seekers" />
              <Area type="monotone" dataKey="employers" stroke="#F4E04D" fillOpacity={1} fill="url(#colorEmployers)" name="Employers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Activity Breakdown */}
      <div className="charts-grid">
        <div className="chart-container">
          <h2>User Activity Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Total Users', value: parseInt(activity.total_users || 0) },
              { name: 'Active (30d)', value: parseInt(activity.active_last_30_days || 0) },
              { name: 'Active (7d)', value: parseInt(activity.active_last_7_days || 0) },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#4CAF50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Retention Metrics</h2>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '64px', fontWeight: '700', color: '#4CAF50', marginBottom: '8px' }}>
                {retention.retention_rate || 0}%
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>
                30-Day Retention Rate
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '600', color: '#2196F3' }}>
                  {retention.cohort_size || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  Cohort Size
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '600', color: '#4CAF50' }}>
                  {retention.retained_users || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  Retained Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Insights */}
      <div className="data-card">
        <h2>Growth Insights</h2>
        <div style={{ padding: '24px' }}>
          <div className="insight-item">
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>📊</div>
            <div className="insight-content">
              <h3>Daily Average New Users</h3>
              <p>{Math.round(parseInt(activity.new_last_30_days || 0) / 30)} users per day in the last 30 days</p>
            </div>
          </div>
          <div className="insight-item" style={{ marginTop: '16px' }}>
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>🎯</div>
            <div className="insight-content">
              <h3>Weekly Growth</h3>
              <p>{activity.new_last_7_days || 0} new users joined in the last 7 days</p>
            </div>
          </div>
          <div className="insight-item" style={{ marginTop: '16px' }}>
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>⚡</div>
            <div className="insight-content">
              <h3>Active Users</h3>
              <p>{((parseInt(activity.active_last_30_days || 0) / parseInt(activity.total_users || 1)) * 100).toFixed(1)}% of all job seekers were active in the last 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementAnalytics;
