import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.css';

interface ApplicationsAnalyticsProps {
  token: string;
}

const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3'];

const ApplicationsAnalytics: React.FC<ApplicationsAnalyticsProps> = ({ token }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/crm/analytics/applications-detailed', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Applications analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading applications analytics...</div>;
  }

  // Transform status timeline data for stacked area chart
  const statusTimelineData = data?.statusTimeline || [];
  const groupedTimeline = statusTimelineData.reduce((acc: any, curr: any) => {
    const existing = acc.find((item: any) => item.date === curr.date);
    if (existing) {
      existing[curr.status] = curr.count;
    } else {
      acc.push({
        date: curr.date,
        [curr.status]: curr.count,
      });
    }
    return acc;
  }, []);

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>📝 Applications Insights</h1>
        <p>Detailed breakdown of application trends, success rates, and employer response times</p>
      </header>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            ✅
          </div>
          <div className="metric-content">
            <h3>{data?.successRateByJobType?.reduce((sum: number, item: any) => sum + parseInt(item.accepted || 0), 0) || 0}</h3>
            <p>Accepted Applications</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            ⏱️
          </div>
          <div className="metric-content">
            <h3>{data?.averageResponseTime?.[0]?.avg_hours_to_response ? Math.round(data.averageResponseTime[0].avg_hours_to_response) : 0}h</h3>
            <p>Avg Response Time</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            📊
          </div>
          <div className="metric-content">
            <h3>{data?.successRateByJobType?.[0]?.success_rate || 0}%</h3>
            <p>Success Rate</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            👥
          </div>
          <div className="metric-content">
            <h3>{data?.topApplicants?.length || 0}</h3>
            <p>Active Applicants</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Application Status Timeline */}
        {groupedTimeline.length > 0 && (
          <div className="chart-container">
            <h2>Application Status Trend (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={groupedTimeline}>
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
                <Line type="monotone" dataKey="pending" stroke="#2196F3" name="Pending" strokeWidth={2} />
                <Line type="monotone" dataKey="accepted" stroke="#4CAF50" name="Accepted" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#F44336" name="Rejected" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Success Rate by Job Type */}
        {data?.successRateByJobType && (
          <div className="chart-container">
            <h2>Success Rate by Job Type</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.successRateByJobType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="job_type" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
                <Bar dataKey="success_rate" fill="#4CAF50" name="Success Rate %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Applicants Table */}
      <div className="data-card">
        <h2>Most Active Job Seekers</h2>
        <div className="data-list">
          {data?.topApplicants?.map((applicant: any, index: number) => (
            <div key={index} className="data-item">
              <div className="rank">#{index + 1}</div>
              <div className="info">
                <strong>{applicant.name}</strong>
                <small>{applicant.email}</small>
              </div>
              <div className="stats">
                <span className="badge">📄 {applicant.application_count} applications</span>
                <span className="badge" style={{ background: 'rgba(76, 175, 80, 0.25)', color: '#4CAF50' }}>
                  ✅ {applicant.accepted_count} accepted
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Time by Status */}
      {data?.averageResponseTime && (
        <div className="chart-container">
          <h2>Average Response Time by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.averageResponseTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="status" stroke="#666" />
              <YAxis stroke="#666" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                formatter={(value: any) => `${Math.round(value)} hours`}
              />
              <Bar dataKey="avg_hours_to_response" fill="#FF9800" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ApplicationsAnalytics;
