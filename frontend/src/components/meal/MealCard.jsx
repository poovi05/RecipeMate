import React from 'react';

export const MealCard = ({
  meal,
  dayIndex,
  mealTypeKey,
  onCooked,
  onNotCooked,
  onChangeMeal,
  onReschedule,
  onViewRecipe
}) => {
  if (!meal) return null;

  const isCooked = meal.status === 'Cooked';
  const isSkipped = meal.status === 'Skipped';
  const isRescheduled = meal.status === 'Rescheduled';

  return (
    <div style={{
      background: '#ffffff',
      border: `1px solid ${
        isCooked ? '#a7f3d0' : isSkipped ? '#fecaca' : isRescheduled ? '#ddd6fe' : '#e2e8f0'
      }`,
      borderRadius: '12px',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
      boxShadow: 'var(--shadow-sm)',
      transition: 'var(--transition)'
    }}>
      {/* Header: Slot Name & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {meal.mealType}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>• {meal.time || '1:00 PM'}</span>
        </div>

        <span
          className={`badge ${
            isCooked
              ? 'badge-success'
              : isSkipped
              ? 'badge-danger'
              : isRescheduled
              ? 'badge-purple'
              : 'badge-neutral'
          }`}
          style={{ fontSize: '0.68rem' }}
        >
          {meal.status}
        </span>
      </div>

      {/* Recipe Title & Quick Click */}
      <div
        onClick={() => onViewRecipe && onViewRecipe(meal.recipeId)}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
          {meal.recipeName}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
          👥 {meal.servings || 2} servings
        </div>
      </div>

      {/* Cooked Feedback or Skip Note */}
      {isCooked && (
        <div style={{
          background: '#f0fdf4',
          borderRadius: '8px',
          padding: '6px 8px',
          fontSize: '0.75rem',
          color: '#166534',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>⭐ {meal.rating || 5}/5 rating</span>
          <span>Prep: {meal.prepDifficulty || 'Easy'}</span>
        </div>
      )}

      {isSkipped && (
        <div style={{
          background: '#fef2f2',
          borderRadius: '8px',
          padding: '6px 8px',
          fontSize: '0.75rem',
          color: '#991b1b',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <span>Reason: {meal.skipReason || 'No time'}</span>
          <button
            onClick={() => onReschedule && onReschedule(dayIndex, mealTypeKey, meal)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.7rem', padding: '3px 8px', borderColor: '#fca5a5', color: '#b91c1c' }}
          >
            🔄 Reschedule Slot
          </button>
        </div>
      )}

      {/* Action Buttons for Planned Meals */}
      {!isCooked && !isSkipped && !isRescheduled && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <button
            onClick={() => onCooked && onCooked(dayIndex, mealTypeKey, meal)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, padding: '5px 8px', fontSize: '0.75rem' }}
            title="Mark as Cooked"
          >
            ✅ Cooked
          </button>
          <button
            onClick={() => onNotCooked && onNotCooked(dayIndex, mealTypeKey, meal)}
            className="btn btn-danger btn-sm"
            style={{ flex: 1, padding: '5px 8px', fontSize: '0.75rem' }}
            title="Mark as Not Cooked"
          >
            ❌ Skip
          </button>
          <button
            onClick={() => onChangeMeal && onChangeMeal(dayIndex, mealTypeKey, meal)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
            title="Change Meal"
          >
            🔄
          </button>
        </div>
      )}
    </div>
  );
};
