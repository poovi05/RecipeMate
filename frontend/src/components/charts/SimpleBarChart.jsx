import React from 'react';

export const SimpleBarChart = ({ title, data = [], height = 180 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 10);

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
        {title}
      </h4>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '12px',
        height: `${height}px`,
        paddingTop: '20px',
        borderBottom: '1px solid var(--border)'
      }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxValue) * 100);
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color || '#10b981' }}>
                {item.value}
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${Math.max(heightPercent, 6)}%`,
                  background: item.color || 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease'
                }}
              />
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
