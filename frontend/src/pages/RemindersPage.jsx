import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';

export const RemindersPage = ({ setActiveTab }) => {
  const { mealPlan, groceryList, getExpiringItems, notifications, markNotificationAsRead } = useAppState();

  const todayPlan = mealPlan && mealPlan.length > 0 ? mealPlan[0] : null;
  const expiringItems = getExpiringItems();
  const unpurchasedGrocery = (groceryList || []).filter(g => !g.purchased);

  const [activeAlert, setActiveAlert] = useState(null);

  // Four Core Reminder Categories
  const reminderCategories = [
    {
      id: 'upcoming-meal',
      type: 'meal',
      title: 'Upcoming Planned Meal Reminder',
      icon: '🍲',
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      activeText: todayPlan?.meals?.lunch?.recipeName
        ? `Next: ${todayPlan.meals.lunch.recipeName} scheduled for ${todayPlan.meals.lunch.time || '01:00 PM'}`
        : 'Breakfast, Lunch & Dinner alert timers synced with your schedule',
      actionText: 'View Today’s Plan',
      onAction: () => setActiveTab('planner')
    },
    {
      id: 'grocery-reminder',
      type: 'grocery',
      title: 'Grocery Deficit Reminder',
      icon: '🛒',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      activeText: unpurchasedGrocery.length > 0
        ? `You have ${unpurchasedGrocery.length} pending items to purchase for upcoming planned meals.`
        : 'All required ingredients are packed and ready.',
      actionText: 'Open Grocery List',
      onAction: () => setActiveTab('grocery')
    },
    {
      id: 'expiry-reminder',
      type: 'expiry',
      title: 'Ingredient / Food Expiry Alert',
      icon: '⚠️',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      activeText: expiringItems.length > 0
        ? `${expiringItems.length} kitchen item(s) nearing expiry (${expiringItems.map(i => i.name).join(', ')}). Cook them today to avoid waste!`
        : 'Zero items expiring in the next 48 hours. Kitchen stock is fresh.',
      actionText: 'Check Inventory',
      onAction: () => setActiveTab('inventory')
    },
    {
      id: 'reschedule-reminder',
      type: 'reschedule',
      title: 'Rescheduled Meal Tracking',
      icon: '🔄',
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      activeText: 'Tracks any skipped or rescheduled meals so you never lose track of unused planned ingredients.',
      actionText: 'View History',
      onAction: () => setActiveTab('history')
    }
  ];

  const handleSimulateAlert = (cat) => {
    setActiveAlert(`🔔 [RecipeMate Reminder Triggered]: ${cat.title} - ${cat.activeText}`);
    setTimeout(() => setActiveAlert(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>🔔 In-App Reminders & Notification System</h2>
          <span className="badge badge-info">Automated Scheduler</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Manages real-time household cooking alerts across four essential dimensions: upcoming meals, grocery deficits, pantry expiry, and rescheduled dishes.
        </p>
      </div>

      {/* Simulated Live Alert Banner */}
      {activeAlert && (
        <div style={{
          background: '#eff6ff',
          border: '1.5px solid #3b82f6',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: '#1d4ed8',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span style={{ fontSize: '2rem' }}>🔔</span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.95rem' }}>Notification Dispatched!</strong>
            <p style={{ fontSize: '0.86rem', marginTop: '2px', color: '#1e3a8a' }}>{activeAlert}</p>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="btn btn-secondary btn-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Core Reminder Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {reminderCategories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              border: `1.5px solid ${cat.border}`,
              background: cat.bg
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2.2rem' }}>{cat.icon}</span>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{cat.title}</h4>
                <span className="badge" style={{ background: '#ffffff', color: cat.color, border: `1px solid ${cat.border}`, fontSize: '0.7rem' }}>
                  Active Module
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, flex: 1 }}>
              {cat.activeText}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
              <button
                onClick={() => handleSimulateAlert(cat)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                ⚡ Test Trigger
              </button>
              <button
                onClick={cat.onAction}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                {cat.actionText} ➔
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live System Notification History */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              Recent Notification Log ({notifications.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Chronological log of alerts dispatched to user session
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
            No alerts generated yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.actionUrl) setActiveTab(n.actionUrl);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: n.unread ? '#f0fdf4' : '#f8fafc',
                  border: n.unread ? '1.5px solid #86efac' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {n.type === 'meal' ? '🍲' : n.type === 'expiry' ? '⚠️' : n.type === 'grocery' ? '🛒' : '🔄'}
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{n.title}</strong>
                    {n.unread && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>New</span>}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', marginLeft: '32px' }}>
                    {n.message}
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
