import React from 'react';

interface JobsProps {
  token: string;
}

const Jobs: React.FC<JobsProps> = () => {
  return (
    <div>
      <header className="page-header">
        <h1>Jobs Management</h1>
        <p>View and manage all job postings</p>
      </header>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💼</div>
        <h2 style={{ marginBottom: '8px' }}>Jobs Management Coming Soon</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          This feature is under development. You'll be able to view, edit, and manage all job postings here.
        </p>
      </div>
    </div>
  );
};

export default Jobs;
