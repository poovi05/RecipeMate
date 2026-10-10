import React from 'react';

export const SimplePieChart = ({ title, data = [] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
        {title}
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Visual Multi-Segment Bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            display: 'flex',
            height: '18px',
            borderRadius: '9px',
            overflow: 'hidden',
            background: '#f1f5f9'
          }}>
            {data.map((item, idx) => {
              const widthPct = (item.value / total) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    width: `${widthPct}%`,
                    background: item.color || '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                  title={`${item.label}: ${item.value} (${Math.round(widthPct)}%)`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.map((item, idx) => {
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                    <span style={{ color: '#334155' }}>{item.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{pct}% ({item.value})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
