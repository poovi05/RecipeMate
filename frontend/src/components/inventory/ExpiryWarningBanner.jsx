import React from 'react';

export const ExpiryWarningBanner = ({ expiringItems, onFindRecipes }) => {
  if (!expiringItems || expiringItems.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '1.5px solid #fde68a',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: '#f59e0b',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem'
        }}>
          ⚠️
        </div>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#92400e' }}>
            Urgent Expiry Notice ({expiringItems.length} items expiring in ≤ 2 days)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#b45309', marginTop: '2px' }}>
            {expiringItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
          </p>
        </div>
      </div>

      <button
        onClick={() => onFindRecipes && onFindRecipes(expiringItems.map(i => i.name))}
        className="btn btn-primary"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          fontSize: '0.85rem',
          padding: '8px 16px'
        }}
      >
        ✨ Find Recipes to Use Them Before Expiry
      </button>
    </div>
  );
};
