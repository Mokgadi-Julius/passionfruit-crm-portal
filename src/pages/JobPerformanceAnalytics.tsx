import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.css';

interface JobPerformanceAnalyticsProps {
  token: string;
}

const JobPerformanceAnalytics: React.FC<JobPerformanceAnalyticsProps> = ({ token }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/crm/analytics/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Job analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading job performance analytics...</div>;
  }

  const conversion = data?.conversionMetrics || {};
  const topJobs = data?.topJobs || [];
  const jobTypes = data?.jobTypeDistribution || [];
  const timeline = data?.timeline || [];

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>🎯 Job Performance</h1>
        <p>Analyze which job types perform best, view counts, and application conversion rates</p>
      </header>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
            💼
          </div>
          <div className="metric-content">
            <h3>{conversion.total_jobs || 0}</h3>
            <p>Active Jobs</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            👁️
          </div>
          <div className="metric-content">
            <h3>{parseInt(conversion.total_views || 0).toLocaleString()}</h3>
            <p>Total Views</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            📄
          </div>
          <div className="metric-content">
            <h3>{parseInt(conversion.total_applications || 0).toLocaleString()}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            📊
          </div>
          <div className="metric-content">
            <h3>{conversion.overall_conversion_rate || 0}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Job Posting Timeline */}
        {timeline.length > 0 && (
          <div className="chart-container">
            <h2>Jobs Posted (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeline}>
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
                <Line type="monotone" dataKey="count" stroke="#2196F3" name="Jobs Posted" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Job Type Performance */}
        {jobTypes.length > 0 && (
          <div className="chart-container">
            <h2>Performance by Job Type</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={jobTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="job_type" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value: any) => Math.round(value)}
                />
                <Legend />
                <Bar dataKey="avg_applications" fill="#4CAF50" name="Avg Applications" radius={[8, 8, 0, 0]} />
                <Bar dataKey="avg_views" fill="#2196F3" name="Avg Views" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Performing Jobs */}
      <div className="data-card">
        <h2>Top Performing Jobs</h2>
        <div className="data-list">
          {topJobs.map((job: any, index: number) => (
            <div key={index} className="data-item">
              <div className="rank">#{index + 1}</div>
              <div className="info">
                <strong>{job.title}</strong>
                <small>{job.company_name} • {job.location}</small>
              </div>
              <div className="stats">
                <span className="badge">👁️ {job.views_count} views</span>
                <span className="badge" style={{ background: 'rgba(76, 175, 80, 0.25)', color: '#4CAF50' }}>
                  📄 {job.applications_count} applications
                </span>
                <span className="badge" style={{ background: 'rgba(33, 150, 243, 0.25)', color: '#2196F3' }}>
                  📊 {job.conversion_rate}% conversion
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Type Distribution */}
      {jobTypes.length > 0 && (
        <div className="chart-container">
          <h2>Job Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobTypes} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" />
              <YAxis type="category" dataKey="job_type" stroke="#666" width={100} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#FF9800" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default JobPerformanceAnalytics;
