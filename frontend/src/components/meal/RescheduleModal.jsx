import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const RescheduleModal = ({
  isOpen,
  onClose,
  mealData,
  mealPlan,
  onConfirmReschedule,
  alternativeRecipes = [],
  onSelectAlternative
}) => {
  const [targetDayIndex, setTargetDayIndex] = useState(
    mealData ? Math.min(mealData.dayIndex + 1, mealPlan.length - 1) : 1
  );
  const [targetMealKey, setTargetMealKey] = useState(mealData?.mealTypeKey || 'dinner');
  const [activeTab, setActiveTab] = useState('reschedule'); // 'reschedule' | 'swap'

  if (!isOpen || !mealData) return null;

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    onConfirmReschedule(mealData.dayIndex, mealData.mealTypeKey, targetDayIndex, targetMealKey);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🔄 Adaptive Assistant: ${mealData.meal?.recipeName}`}
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Mode Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('reschedule')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: activeTab === 'reschedule' ? '#ffffff' : 'transparent',
              color: activeTab === 'reschedule' ? '#10b981' : '#64748b',
              boxShadow: activeTab === 'reschedule' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            📅 Reschedule to Future Day
          </button>
          <button
            onClick={() => setActiveTab('swap')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: activeTab === 'swap' ? '#ffffff' : 'transparent',
              color: activeTab === 'swap' ? '#3b82f6' : '#64748b',
              boxShadow: activeTab === 'swap' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            ✨ Cook an Alternative Now
          </button>
        </div>

        {/* Tab 1: Reschedule Slot */}
        {activeTab === 'reschedule' && (
          <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.84rem', color: '#475569' }}>
              Moving <strong>{mealData.meal?.recipeName}</strong> to another day prevents ingredient wastage and keeps your meal goals on track.
            </div>

            <div className="form-group">
              <label className="form-label">Target Day</label>
              <select
                className="form-select"
                value={targetDayIndex}
                onChange={(e) => setTargetDayIndex(Number(e.target.value))}
              >
                {mealPlan.map((day, idx) => (
                  <option key={idx} value={idx}>
                    {day.dayName} ({day.dateLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Meal Slot</label>
              <select
                className="form-select"
                value={targetMealKey}
                onChange={(e) => setTargetMealKey(e.target.value)}
              >
                <option value="breakfast">Breakfast (08:00 AM)</option>
                <option value="lunch">Lunch (01:00 PM)</option>
                <option value="snack">Snack (05:00 PM)</option>
                <option value="dinner">Dinner (08:00 PM)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Reschedule
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Quick Alternative */}
        {activeTab === 'swap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Quick alternatives requiring fewer ingredients and minimal prep:
            </p>
            {alternativeRecipes.slice(0, 3).map((alt) => (
              <div
                key={alt.id}
                onClick={() => {
                  onSelectAlternative(alt);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{alt.imageEmoji || '🍳'}</span>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{alt.name}</h5>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      ⏱️ {alt.cookingTime} min • {alt.difficulty}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">
                  Replace & Cook
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
