import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { notifications, markNotificationAsRead, getExpiringItems, groceryList } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = (notifications || []).filter((n) => n.unread).length;
  const expiringCount = getExpiringItems().length;
  const unpurchasedGroceryCount = (groceryList || []).filter((g) => !g.purchased).length;

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'recipes', label: 'Recipes', icon: '🍲' },
    { id: 'planner', label: 'Meal Planner', icon: '📅' },
    {
      id: 'grocery',
      label: 'Grocery List',
      icon: '🛒',
      badge: unpurchasedGroceryCount > 0 ? unpurchasedGroceryCount : null
    },
    { id: 'inventory', label: 'Inventory', icon: '📦' }
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin-dashboard', label: 'Admin Portal', icon: '🛡️', isAdminOnly: true });
  }

  return (
    <header style={{
      height: '70px',
      background: '#ffffff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Tagline */}
      <div
        onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
        }}>
          🍲
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
              RecipeMate
            </span>
            <span className="ai-badge">AI Core</span>
          </div>
          <p style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
            Food Recipes, Meal Planner & Grocery Management
          </p>
        </div>
      </div>

      {/* Main Top Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {navLinks.map((link) => {
          const isActive = activeTab === link.id || (link.id === 'recipes' && activeTab === 'recipes');
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#ecfdf5' : 'transparent',
                color: isActive ? '#065f46' : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && (
                <span style={{
                  background: '#3b82f6',
                  color: 'white',
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Expiry Pill Warning */}
        {expiringCount > 0 && !isAdmin && (
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ⚠️ {expiringCount} item{expiringCount > 1 ? 's' : ''} expiring!
          </button>
        )}

        {/* In-App Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              position: 'relative'
            }}
            title="Notifications & Reminders"
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '340px',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notifications & Alerts</h4>
                <button
                  onClick={() => {
                    setActiveTab('reminders');
                    setShowNotifications(false);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  View All ➔
                </button>
              </div>

              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
                  No new reminders or notifications.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.actionUrl) setActiveTab(n.actionUrl);
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: n.unread ? '#f0fdf4' : '#f8fafc',
                        border: n.unread ? '1px solid #bbf7d0' : '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{n.title}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 6px',
              borderRadius: '30px',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isAdmin ? '#3b82f6' : '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}>
              {currentUser?.avatar || (isAdmin ? '🛡️' : '👤')}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                {currentUser?.name || 'Account'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {currentUser?.role === 'ADMIN' ? '🛡️ Administrator' : '👨‍🍳 Member'}
              </div>
            </div>
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '220px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
              padding: '10px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>{currentUser?.name}</p>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 6px 0' }}>{currentUser?.email}</p>
                <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-success'}`}>
                  {currentUser?.role === 'ADMIN' ? 'Administrator' : `${currentUser?.dietaryPreference || 'Vegetarian'}`}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setActiveTab('dashboard');
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
              >
                👤 Profile & Preferences
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveTab('admin-dashboard');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
                >
                  🛡️ Admin Console
                </button>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  setActiveTab('landing');
                }}
                className="btn btn-danger btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', marginTop: '6px' }}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
