import React from 'react';

export const RecipeCard = ({ recipe, onSelect, onQuickCook, showMatch = true }) => {
  const match = recipe.matchData;
  const dietCategory = recipe.dietCategory || (recipe.dietType === 'Vegetarian' ? 'Vegetarian' : 'Non-Vegetarian');
  const mealCategory = recipe.mealCategory || recipe.category || 'Lunch';

  const getDietBadgeStyle = (diet) => {
    switch (diet) {
      case 'Vegetarian':
        return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', label: '🟢 Veg' };
      case 'Egg':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: '🍳 Egg' };
      case 'Healthy/Diet':
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', label: '🥗 Healthy Diet' };
      case 'Non-Vegetarian':
      default:
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', label: '🔴 Non-Veg' };
    }
  };

  const dietBadge = getDietBadgeStyle(dietCategory);

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      {/* Top Banner with Food Emoji, Category, and Dietary Tag */}
      <div style={{
        height: '110px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: '3.6rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))' }}>
          {recipe.imageEmoji || '🍲'}
        </span>

        {/* Dietary Category Tag */}
        <span
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '0.72rem',
            padding: '3px 9px',
            borderRadius: '20px',
            fontWeight: 700,
            background: dietBadge.bg,
            color: dietBadge.text,
            border: `1px solid ${dietBadge.border}`
          }}
        >
          {dietBadge.label}
        </span>

        {/* Food / Meal Category Tag */}
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.95)',
            color: '#334155',
            border: '1px solid #e2e8f0'
          }}
        >
          {recipe.regionalCategory ? `${recipe.regionalCategory} • ${mealCategory}` : mealCategory}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
            {recipe.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap' }}>
            <span>⏱️ {recipe.cookingTime} mins</span>
            <span>⚡ {recipe.difficulty}</span>
            <span>👥 {recipe.servings} Servings</span>
            <span>⭐ {recipe.rating || 4.8}</span>
          </div>
        </div>

        {/* AI Ingredient Match Indicator */}
        {showMatch && match && (
          <div style={{
            background: match.matchedCount > 0 ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${match.matchedCount > 0 ? '#bbf7d0' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: match.matchedCount > 0 ? '#166534' : '#64748b' }}>
                {match.matchedCount > 0
                  ? `✨ Uses ${match.matchedCount} of your in-stock ingredients`
                  : `Requires ${match.totalRequired} ingredients`}
              </span>
              {match.canCookNow && (
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  Ready to Cook!
                </span>
              )}
            </div>

            {match.missing && match.missing.length > 0 && (
              <p style={{ color: '#dc2626', fontSize: '0.72rem', marginTop: '3px', margin: '3px 0 0 0' }}>
                Missing: {match.missing.slice(0, 3).map(m => m.name).join(', ')}
                {match.missing.length > 3 ? ` +${match.missing.length - 3} more` : ''}
              </p>
            )}
          </div>
        )}

        {/* Explainable AI Reasoning if available */}
        {recipe.recommendationReason && (
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '8px 10px',
            fontSize: '0.74rem',
            color: '#1e40af',
            lineHeight: 1.4
          }}>
            💡 <strong>AI Recommendation:</strong> {recipe.recommendationReason}
          </div>
        )}

        {/* Recipe Ingredients & Prep summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
          <span>🛒 {recipe.ingredients?.length || 0} ingredients</span>
          <span>📝 {recipe.steps?.length || 0} preparation steps</span>
        </div>

        {/* Nutrition Pills */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem' }}>
          <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', color: '#475569' }}>
            🔥 {recipe.calories} kcal
          </span>
          <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', color: '#475569' }}>
            🥩 {recipe.protein} protein
          </span>
        </div>

        {/* Card Footer Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onSelect && onSelect(recipe)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            📖 View Recipe
          </button>
          {onQuickCook && (
            <button
              onClick={() => onQuickCook(recipe)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              🍳 Cook This
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default RecipeCard;
