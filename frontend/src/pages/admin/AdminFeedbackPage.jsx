import React, { useState, useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const AdminFeedbackPage = () => {
  const { feedbackList } = useAppState();
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return feedbackList.filter((fb) => {
      const matchType = filterType === 'All' || fb.type === filterType;
      const matchSearch =
        fb.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.comment.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [feedbackList, filterType, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>💬 User Feedback & Audit Console</h2>
          <span className="badge badge-info">{feedbackList.length} Entries</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Monitor community ratings, cooking difficulty assessments, and recommendation quality.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '320px' }}
          placeholder="🔍 Search feedback by user or dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Recipe Feedback', 'Meal Planner Feedback'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filterType === t ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: filterType === t ? 'var(--primary-light)' : '#ffffff',
                color: filterType === t ? 'var(--primary-dark)' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Stream Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>User</th>
                <th style={{ padding: '14px 20px' }}>Type</th>
                <th style={{ padding: '14px 20px' }}>Recipe / Target</th>
                <th style={{ padding: '14px 20px' }}>Rating</th>
                <th style={{ padding: '14px 20px' }}>Comment</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fb) => (
                <tr key={fb.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                    {fb.userName}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="badge badge-neutral">{fb.type}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#334155' }}>
                    {fb.recipeName}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#f59e0b', fontWeight: 700 }}>
                    {'★'.repeat(fb.rating)} ({fb.rating}/5)
                  </td>
                  <td style={{ padding: '14px 20px', color: '#475569', maxWidth: '300px' }}>
                    "{fb.comment}"
                  </td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8' }}>
                    {fb.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
