import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Jobs from './pages/Jobs';
import Analytics from './pages/Analytics';
import ApplicationsAnalytics from './pages/ApplicationsAnalytics';
import CreditsAnalytics from './pages/CreditsAnalytics';
import JobPerformanceAnalytics from './pages/JobPerformanceAnalytics';
import UserEngagementAnalytics from './pages/UserEngagementAnalytics';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyAdminAccess();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdminAccess = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'admin') {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
      } else {
        localStorage.removeItem('admin_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Admin verification failed:', error);
      localStorage.removeItem('admin_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={token && isAdmin ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard token={token!} />} />
          <Route path="users" element={<Users token={token!} />} />
          <Route path="jobs" element={<Jobs token={token!} />} />
          <Route path="analytics" element={<Analytics token={token!} />} />
          <Route path="analytics/applications" element={<ApplicationsAnalytics token={token!} />} />
          <Route path="analytics/credits" element={<CreditsAnalytics token={token!} />} />
          <Route path="analytics/jobs" element={<JobPerformanceAnalytics token={token!} />} />
          <Route path="analytics/engagement" element={<UserEngagementAnalytics token={token!} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
