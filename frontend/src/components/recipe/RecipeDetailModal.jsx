import React from 'react';
import { Modal } from '../common/Modal';

export const RecipeDetailModal = ({ recipe, isOpen, onClose, onMarkCooked }) => {
  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.name} maxWidth="680px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Hero */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '14px',
          border: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '4rem' }}>{recipe.imageEmoji || '🍲'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span className="badge badge-success">{recipe.category}</span>
              <span className="badge badge-info">⏱️ {recipe.cookingTime} mins</span>
              <span className="badge badge-purple">👥 {recipe.servings} Servings</span>
              <span className="badge badge-warning">⚡ {recipe.difficulty}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Rich Indian staple. Ideal for healthy eating, energy replenishment, and balanced home nutrition.
            </p>
          </div>
        </div>

        {/* Nutritional Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>Calories</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>{recipe.calories} kcal</div>
          </div>
          <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 600 }}>Protein</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>{recipe.protein}</div>
          </div>
          <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>Diet</span>
            <div style={{ fontSize: '1.0rem', fontWeight: 800, color: '#1e3a8a' }}>{recipe.dietType}</div>
          </div>
          <div style={{ background: '#ede9fe', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#5b21b6', fontWeight: 600 }}>Rating</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4c1d95' }}>⭐ {recipe.rating || 4.8}</div>
          </div>
        </div>

        {/* Required Ingredients */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛒</span> Required Ingredients
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            background: '#f8fafc',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}>
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{ing.name}:</span>
                <span style={{ color: '#64748b' }}>{ing.amount} {ing.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step Preparation */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👨‍🍳</span> Preparation Steps
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recipe.steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          {onMarkCooked && (
            <button
              onClick={() => {
                onClose();
                onMarkCooked(recipe);
              }}
              className="btn btn-primary"
            >
              ✅ I Cooked This Meal
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default RecipeDetailModal;