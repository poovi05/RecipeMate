import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const AdminMealPlansPage = () => {
  const { mealPlan, mealHistory } = useAppState();
  const [statusFilter, setStatusFilter] = useState('All');

  // Consolidate meal items across users
  const simulatedUserMeals = [
    { id: 'u-1', user: 'Priya Sharma', date: 'Today', meal: 'Breakfast', recipe: 'Crispy Dosa with Coconut Chutney', status: 'Cooked' },
    { id: 'u-2', user: 'Priya Sharma', date: 'Today', meal: 'Lunch', recipe: 'Classic Sambar with Steamed Rice', status: 'Cooked' },
    { id: 'u-3', user: 'Rahul Verma', date: 'Today', meal: 'Dinner', recipe: 'Sprouted Moong Salad', status: 'Cooked' },
    { id: 'u-4', user: 'Kavita Nair', date: 'Yesterday', meal: 'Dinner', recipe: 'Vegetable Upma', status: 'Skipped' },
    { id: 'u-5', user: 'Priya Sharma', date: 'Tomorrow', meal: 'Breakfast', recipe: 'Soft Idli with Tomato Rasam', status: 'Planned' },
    { id: 'u-6', user: 'Rahul Verma', date: 'Tomorrow', meal: 'Lunch', recipe: 'Amritsari Chole Masala', status: 'Planned' },
    { id: 'u-7', user: 'Kavita Nair', date: '2 days ago', meal: 'Dinner', recipe: 'Palak Paneer', status: 'Rescheduled' }
  ];

  const filtered = simulatedUserMeals.filter(
    (m) => statusFilter === 'All' || m.status === statusFilter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📅 User Meal Plan Monitoring</h2>
          <span className="badge badge-info">System Wide Compliance</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Real-time oversight of daily scheduled meals and execution compliance across all household accounts.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '8px' }}>
        {['All', 'Cooked', 'Planned', 'Skipped', 'Rescheduled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: statusFilter === st ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: statusFilter === st ? 'var(--primary-light)' : '#ffffff',
              color: statusFilter === st ? 'var(--primary-dark)' : '#475569',
              fontSize: '0.82rem',
              fontWeight: statusFilter === st ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>User</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px' }}>Slot</th>
                <th style={{ padding: '14px 20px' }}>Scheduled Recipe</th>
                <th style={{ padding: '14px 20px' }}>Execution Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                    {item.user}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>
                    {item.date}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    {item.meal}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>
                    {item.recipe}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      className={`badge ${
                        item.status === 'Cooked'
                          ? 'badge-success'
                          : item.status === 'Skipped'
                          ? 'badge-danger'
                          : item.status === 'Rescheduled'
                          ? 'badge-purple'
                          : 'badge-neutral'
                      }`}
                    >
                      {item.status}
                    </span>
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
