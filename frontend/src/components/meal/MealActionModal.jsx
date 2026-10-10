import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const MealActionModal = ({
  isOpen,
  onClose,
  mode, // 'cooked' | 'notCooked' | 'change'
  mealData,
  onSubmitCooked,
  onSubmitNotCooked,
  onTriggerReschedule,
  alternativeRecipes = [],
  onSelectAlternative
}) => {
  // Cooked Form State
  const [rating, setRating] = useState(5);
  const [tasteNotes, setTasteNotes] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [prepTime, setPrepTime] = useState('20 min');

  // Not Cooked Form State
  const [skipReason, setSkipReason] = useState('No time');
  const [otherReason, setOtherReason] = useState('');

  if (!isOpen || !mealData) return null;

  const handleCookedSubmit = (e) => {
    e.preventDefault();
    onSubmitCooked({
      rating,
      review: tasteNotes || 'Cooked delicious home meal!',
      prepDifficulty: difficulty,
      prepTime
    });
    onClose();
  };

  const handleNotCookedSubmit = (e) => {
    e.preventDefault();
    const finalReason = skipReason === 'Other' ? (otherReason || 'Other') : skipReason;
    onSubmitNotCooked({
      reason: finalReason
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'cooked'
          ? `🎉 Meal Feedback: ${mealData.meal?.recipeName}`
          : mode === 'notCooked'
          ? `⚠️ Why wasn't ${mealData.meal?.recipeName} cooked?`
          : `🔄 Change Meal: ${mealData.meal?.recipeName}`
      }
      maxWidth="540px"
    >
      {/* 1. Cooked Modal */}
      {mode === 'cooked' && (
        <form onSubmit={handleCookedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', color: '#166534', fontSize: '0.85rem' }}>
            Awesome job cooking at home! Your feedback helps RecipeMate learn your taste preferences.
          </div>

          <div className="form-group">
            <label className="form-label">How delicious was it? (Rating)</label>
            <div style={{ display: 'flex', gap: '10px', fontSize: '1.6rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? '#f59e0b' : '#cbd5e1', transition: 'transform 0.1s' }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '0.9rem', color: '#64748b', alignSelf: 'center', marginLeft: '6px' }}>
                ({rating} out of 5)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Cooking Difficulty</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Very Easy">Very Easy</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Challenging</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Actual Prep Time</label>
              <select
                className="form-select"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              >
                <option value="10 min">~10 minutes</option>
                <option value="15 min">~15 minutes</option>
                <option value="20 min">~20 minutes</option>
                <option value="30 min">~30 minutes</option>
                <option value="45+ min">45+ minutes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Taste & Cooking Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Added a little extra ghee, loved the spice level!"
              value={tasteNotes}
              onChange={(e) => setTasteNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Save Experience
            </button>
          </div>
        </form>
      )}

      {/* 2. Not Cooked Modal */}
      {mode === 'notCooked' && (
        <form onSubmit={handleNotCookedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: '#475569' }}>
            Skipping meals happens! Please tell us why so we can adapt future recommendations:
          </p>

          <div className="form-group">
            <label className="form-label">Reason for skipping</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'No time',
                'No ingredients / Missing items',
                'Too difficult / Tired',
                "Didn't like it",
                'Ordered outside / Eating out',
                'Changed meal to something else',
                'Other'
              ].map((reasonOption) => (
                <label
                  key={reasonOption}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: skipReason === reasonOption ? '#fef2f2' : '#f8fafc',
                    border: `1px solid ${skipReason === reasonOption ? '#fecaca' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: skipReason === reasonOption ? 600 : 400
                  }}
                >
                  <input
                    type="radio"
                    name="skipReason"
                    value={reasonOption}
                    checked={skipReason === reasonOption}
                    onChange={(e) => setSkipReason(e.target.value)}
                  />
                  <span>{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          {skipReason === 'Other' && (
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Specify custom reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </div>
          )}

          <div style={{
            background: '#eff6ff',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #bfdbfe',
            fontSize: '0.82rem',
            color: '#1e40af'
          }}>
            💡 <strong>Adaptive Rescheduling:</strong> After saving, RecipeMate can automatically find an alternative meal or reschedule this to a future date!
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => {
                onTriggerReschedule(mealData.dayIndex, mealData.mealTypeKey, mealData.meal, skipReason);
              }}
              className="btn btn-outline"
              style={{ color: 'var(--purple)', borderColor: '#c4b5fd' }}
            >
              🔄 Reschedule Slot Now
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Mark Skipped
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. Change Meal / Suggest Alternatives Modal */}
      {mode === 'change' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: '#475569' }}>
            Select an alternative Indian home recipe. Ranked by prep time and ingredient availability:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alternativeRecipes.slice(0, 4).map((alt) => (
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
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{alt.imageEmoji || '🍲'}</span>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{alt.name}</h5>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '8px' }}>
                      <span>⏱️ {alt.cookingTime} min</span>
                      <span>• {alt.category}</span>
                      <span>• {alt.difficulty}</span>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm">
                  Select
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Keep Current Meal
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
