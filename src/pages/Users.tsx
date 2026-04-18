import React, { useState } from 'react';
import '../styles/Users.css';

interface UsersProps {
  token: string;
}

const Users: React.FC<UsersProps> = ({ token }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/crm/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setUsers(data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <header className="page-header">
        <h1>Users</h1>
        <p>Search and manage platform users</p>
      </header>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading} className="search-button">
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {users.length > 0 && (
        <div className="results-section">
          <h2>Found {users.length} user(s)</h2>
          <div className="users-table">
            {users.map((user) => (
              <div key={user.id} className="user-row">
                <div className="user-avatar">
                  {user.role === 'employer' ? '🏢' : '👤'}
                </div>
                <div className="user-info">
                  <strong>{user.first_name} {user.last_name}</strong>
                  <span>{user.email}</span>
                  {user.phone && <span>📞 {user.phone}</span>}
                  {user.company_name && <span>🏢 {user.company_name}</span>}
                </div>
                <div className="user-meta">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                  </span>
                  <small>Joined: {new Date(user.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
