import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

interface AnalyticsProps {
  token: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ token }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/crm/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>📊 Advanced Analytics</h1>
        <p>Comprehensive insights and detailed reports for your platform</p>
      </header>

      {/* Analytics Overview Grid */}
      <div className="analytics-grid">
        {/* Applications Insights */}
        <div className="analytics-card analytics-card-clickable" onClick={() => navigate('/analytics/applications')}>
          <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            📝
          </div>
          <h3>Applications Insights</h3>
          <p className="analytics-description">
            Detailed breakdown of application trends, success rates, and employer response times
          </p>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{parseInt(stats?.total_applications) || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{parseInt(stats?.applications_last_7_days) || 0}</span>
            </div>
          </div>
          <div className="view-analytics-badge">View Analytics →</div>
        </div>

        {/* Credits Analytics */}
        <div className="analytics-card analytics-card-clickable" onClick={() => navigate('/analytics/credits')}>
          <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            💰
          </div>
          <h3>Credits & Revenue</h3>
          <p className="analytics-description">
            Track credit purchases, usage patterns, and revenue trends across employers
          </p>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-label">Total Credits</span>
              <span className="stat-value">{parseInt(stats?.total_credits_in_system)?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Employers</span>
              <span className="stat-value">{parseInt(stats?.employers_with_credits) || 0}</span>
            </div>
          </div>
          <div className="view-analytics-badge">View Analytics →</div>
        </div>

        {/* Job Performance */}
        <div className="analytics-card analytics-card-clickable" onClick={() => navigate('/analytics/jobs')}>
          <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            🎯
          </div>
          <h3>Job Performance</h3>
          <p className="analytics-description">
            Analyze which job types perform best, view counts, and application conversion rates
          </p>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-label">Active Jobs</span>
              <span className="stat-value">{parseInt(stats?.active_jobs) || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg. Applications</span>
              <span className="stat-value">
                {stats?.total_jobs && stats?.total_applications
                  ? Math.round(parseInt(stats.total_applications) / parseInt(stats.total_jobs))
                  : 0}
              </span>
            </div>
          </div>
          <div className="view-analytics-badge">View Analytics →</div>
        </div>

        {/* User Engagement */}
        <div className="analytics-card analytics-card-clickable" onClick={() => navigate('/analytics/engagement')}>
          <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            📈
          </div>
          <h3>User Engagement</h3>
          <p className="analytics-description">
            Monitor user activity, login patterns, and platform engagement metrics
          </p>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-label">New Users (30d)</span>
              <span className="stat-value">{parseInt(stats?.new_users_30_days)?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Growth Rate</span>
              <span className="stat-value">
                {stats?.total_users && stats?.new_users_30_days
                  ? ((parseInt(stats.new_users_30_days) / parseInt(stats.total_users)) * 100).toFixed(1) + '%'
                  : '0%'}
              </span>
            </div>
          </div>
          <div className="view-analytics-badge">View Analytics →</div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--text)' }}>
          Platform Overview
        </h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #F4E04D 0%, #D4C03D 100%)' }}>
              👥
            </div>
            <div className="metric-content">
              <h3>{stats?.total_users?.toLocaleString() || 0}</h3>
              <p>Total Users</p>
              <div className="metric-breakdown">
                <span>{stats?.total_job_seekers || 0} Job Seekers</span>
                <span>{stats?.total_employers || 0} Employers</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
              💼
            </div>
            <div className="metric-content">
              <h3>{stats?.total_jobs?.toLocaleString() || 0}</h3>
              <p>Total Jobs</p>
              <div className="metric-breakdown">
                <span className="success">{stats?.active_jobs || 0} Active</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
              📄
            </div>
            <div className="metric-content">
              <h3>{stats?.total_applications?.toLocaleString() || 0}</h3>
              <p>Applications</p>
              <div className="metric-breakdown">
                <span className="accent">+{stats?.applications_last_7_days || 0} this week</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
              🏆
            </div>
            <div className="metric-content">
              <h3>{stats?.total_credits_in_system?.toLocaleString() || 0}</h3>
              <p>Total Credits</p>
              <div className="metric-breakdown">
                <span>{stats?.employers_with_credits || 0} employers with balance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
