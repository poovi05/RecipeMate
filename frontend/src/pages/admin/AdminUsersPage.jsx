import React, { useState, useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const AdminUsersPage = () => {
  const { usersList, toggleUserStatus, deleteUser } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersList, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>👥 User Management</h2>
          <span className="badge badge-info">{usersList.length} Accounts</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Inspect user profiles, manage active status, and audit dietary preferences.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '340px' }}
          placeholder="🔍 Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Showing {filteredUsers.length} users
        </span>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>User</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>Primary Goal</th>
                <th style={{ padding: '14px 20px' }}>Food Preference</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{user.avatar || '👤'}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-purple' : 'badge-neutral'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>
                    {user.primaryGoal || 'Healthy Eating'}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>
                    {user.foodPreference || 'Pan-Indian'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user ${user.name}?`)) deleteUser(user.id);
                          }}
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
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
