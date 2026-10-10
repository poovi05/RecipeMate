import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isAdmin } = useAuth();
  const { getExpiringItems, groceryList, analyticsData } = useAppState();
  const expiringCount = getExpiringItems().length;
  const pendingGroceries = (groceryList || []).filter((g) => !g.purchased).length;

  const userNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'recipes', label: 'AI Recipes', icon: '🤖', badge: 'Smart' },
    { id: 'planner', label: 'Meal Planner', icon: '📅' },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦',
      badge: expiringCount > 0 ? `${expiringCount} exp` : null,
      badgeType: 'danger'
    },
    {
      id: 'grocery',
      label: 'Grocery List',
      icon: '🛒',
      badge: pendingGroceries > 0 ? `${pendingGroceries}` : null,
      badgeType: 'info'
    },
    { id: 'reminders', label: 'Reminders', icon: '🔔' },
    { id: 'history', label: 'Meal History', icon: '📜' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'analytics', label: 'My Analytics', icon: '📊', badge: 'Eco' }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'admin-users', label: 'Users', icon: '👥' },
    { id: 'admin-recipes', label: 'Recipe Mgmt', icon: '🍲' },
    { id: 'admin-categories', label: 'Categories', icon: '🏷️' },
    { id: 'admin-mealplans', label: 'Meal Plans', icon: '📅' },
    { id: 'admin-feedback', label: 'Feedback & Reviews', icon: '💬' },
    { id: 'admin-reports', label: 'Reports & Analytics', icon: '📈' }
  ];

  const items = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside style={{
      width: '240px',
      background: '#ffffff',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 70px)',
      padding: '20px 14px',
      gap: '6px'
    }}>
      <div style={{
        padding: '0 12px 12px 12px',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        color: 'var(--text-light)'
      }}>
        {isAdmin ? '🛡️ Administration Suite' : '🍲 Personal Meal System'}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#ecfdf5' : 'transparent',
                color: isActive ? '#065f46' : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`badge ${
                    item.badgeType === 'danger'
                      ? 'badge-danger'
                      : item.badgeType === 'info'
                      ? 'badge-info'
                      : 'badge-success'
                  }`}
                  style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sustainable Impact Widget in Sidebar - Strictly Real Data! */}
      {!isAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '14px',
          padding: '14px',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
            <span>♻️</span> Food Waste Tracked
          </div>
          <p style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '4px' }}>
            {Number(analyticsData.foodWasteAvoidedKg) > 0 ? (
              <span>You prevented <strong>{analyticsData.foodWasteAvoidedKg} kg</strong> of food spoilage!</span>
            ) : (
              <span>Cook meals from your plan to track your food waste prevention.</span>
            )}
          </p>
        </div>
      )}
    </aside>
  );
};
