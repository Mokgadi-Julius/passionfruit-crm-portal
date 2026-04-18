import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [topEmployers, setTopEmployers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/crm/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setStats(data.stats);
      setGrowthData(data.growthData);
      setTopEmployers(data.topEmployers);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your Passionfruit Careers platform • {stats?.total_users?.toLocaleString() || 0} total users • {stats?.new_users_30_days || 0} joined in last 30 days</p>
      </header>

      {/* Key Metrics */}
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

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Growth Chart */}
        {growthData.length > 0 && (
          <div className="chart-container">
            <h2>User Growth (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={growthData}>
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
                <Line type="monotone" dataKey="job_seekers" stroke="#2196F3" name="Job Seekers" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="employers" stroke="#F4E04D" name="Employers" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Applications Chart */}
        {growthData.length > 0 && (
          <div className="chart-container">
            <h2>Platform Overview</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[
                { name: 'Job Seekers', value: parseInt(stats?.total_job_seekers) || 0, fill: '#2196F3' },
                { name: 'Employers', value: parseInt(stats?.total_employers) || 0, fill: '#F4E04D' },
                { name: 'Jobs', value: parseInt(stats?.total_jobs) || 0, fill: '#4CAF50' },
                { name: 'Applications', value: parseInt(stats?.total_applications) || 0, fill: '#FF9800' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[
                    { name: 'Job Seekers', value: parseInt(stats?.total_job_seekers) || 0, fill: '#2196F3' },
                    { name: 'Employers', value: parseInt(stats?.total_employers) || 0, fill: '#F4E04D' },
                    { name: 'Jobs', value: parseInt(stats?.total_jobs) || 0, fill: '#4CAF50' },
                    { name: 'Applications', value: parseInt(stats?.total_applications) || 0, fill: '#FF9800' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* User Distribution Pie Chart */}
      <div className="chart-container">
        <h2>User Distribution</h2>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '-16px', marginBottom: '16px' }}>
          {parseInt(stats?.total_job_seekers) || 0} Job Seekers • {parseInt(stats?.total_employers) || 0} Employers
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={[
                { name: 'Job Seekers', value: parseInt(stats?.total_job_seekers) || 0 },
                { name: 'Employers', value: parseInt(stats?.total_employers) || 0 },
              ]}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent, value }) => `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={120}
              innerRadius={0}
              dataKey="value"
            >
              <Cell fill="#2196F3" />
              <Cell fill="#F4E04D" />
            </Pie>
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-grid">
        {/* Top Employers */}
        <div className="data-card">
          <h2>Top Employers</h2>
          <div className="data-list">
            {topEmployers.map((employer, index) => (
              <div key={index} className="data-item">
                <div className="rank">#{index + 1}</div>
                <div className="info">
                  <strong>{employer.company_name}</strong>
                  <small>{employer.email}</small>
                </div>
                <div className="stats">
                  <span className="badge">💼 {employer.job_count} jobs</span>
                  <span className="badge">💳 {employer.credits_balance} credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="data-card">
          <h2>Recent Registrations</h2>
          <div className="data-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="data-item">
                <div className="avatar">
                  {activity.role === 'employer' ? '🏢' : '👤'}
                </div>
                <div className="info">
                  <strong>{activity.name}</strong>
                  <small>{activity.email}</small>
                </div>
                <div className="meta">
                  <span className={`badge ${activity.role}`}>
                    {activity.role === 'employer' ? 'Employer' : 'Job Seeker'}
                  </span>
                  <small>{new Date(activity.timestamp).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="advanced-analytics-section">
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--text)' }}>
          📊 Advanced Analytics
        </h2>

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
      </div>
    </div>
  );
};

export default Dashboard;
