import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';

export const MealHistoryPage = () => {
  const { mealHistory } = useAppState();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    return (mealHistory || []).filter((item) => {
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchSearch =
        (item.recipeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.mealType || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [mealHistory, filterStatus, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📜 Meal Cooking History</h2>
          <span className="badge badge-purple">{mealHistory.length} logs recorded</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Historical record of completed, skipped, and rescheduled meals for personal preference learning.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '300px' }}
          placeholder="🔍 Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Completed', 'Skipped', 'Rescheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filterStatus === st ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: filterStatus === st ? 'var(--primary-light)' : '#ffffff',
                color: filterStatus === st ? 'var(--primary-dark)' : '#475569',
                fontSize: '0.82rem',
                fontWeight: filterStatus === st ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* History Table or Empty State */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {filteredHistory.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '3rem' }}>📜</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No meal history recorded yet</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px', lineHeight: 1.5 }}>
              When you mark meals as Cooked, Skipped, or Rescheduled in your Meal Planner, your execution records, ratings, and taste notes will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Meal Slot</th>
                  <th style={{ padding: '14px 20px' }}>Recipe Name</th>
                  <th style={{ padding: '14px 20px' }}>Outcome Status</th>
                  <th style={{ padding: '14px 20px' }}>User Rating</th>
                  <th style={{ padding: '14px 20px' }}>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                      {item.mealType}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                      {item.recipeName}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        className={`badge ${
                          item.status === 'Completed'
                            ? 'badge-success'
                            : item.status === 'Skipped'
                            ? 'badge-danger'
                            : 'badge-purple'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {item.rating ? (
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                          {'★'.repeat(item.rating)} ({item.rating}/5)
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>
                      {item.reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
