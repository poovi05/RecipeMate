import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { MealCard } from '../components/meal/MealCard';
import { MealActionModal } from '../components/meal/MealActionModal';
import { RescheduleModal } from '../components/meal/RescheduleModal';
import { RecipeDetailModal } from '../components/recipe/RecipeDetailModal';
import { suggestAlternativeRecipes } from '../services/aiEngine';

export const MealPlannerPage = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const {
    mealPlan,
    recipes,
    inventory,
    generateSmartPlan,
    markMealCooked,
    markMealNotCooked,
    rescheduleMeal,
    changeMealRecipe
  } = useAppState();

  // Generator inputs
  const [duration, setDuration] = useState(7);
  const [people, setPeople] = useState(2);
  const [goal, setGoal] = useState(currentUser?.primaryGoal || 'Healthy Eating');
  const [maxCookTime, setMaxCookTime] = useState(30);

  // Active modal states
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeMealModal, setActiveMealModal] = useState({ isOpen: false, mode: 'cooked', data: null });
  const [activeRescheduleModal, setActiveRescheduleModal] = useState({ isOpen: false, data: null });
  const [generationNotice, setGenerationNotice] = useState(false);

  const handleGenerate = () => {
    if (!recipes || recipes.length === 0) {
      alert('Please add at least 1 or 2 recipes to the Recipe catalog before generating a meal plan.');
      return;
    }
    const success = generateSmartPlan(duration, people, goal);
    if (success) {
      setGenerationNotice(true);
      setTimeout(() => setGenerationNotice(false), 4000);
    }
  };

  const getAlternatives = (recipeId, reason = 'No time') => {
    return suggestAlternativeRecipes(
      recipes || [],
      recipeId,
      reason,
      (inventory || []).map((i) => i.name)
    );
  };

  const handleCooked = (dayIndex, mealTypeKey, meal) => {
    setActiveMealModal({
      isOpen: true,
      mode: 'cooked',
      data: { dayIndex, mealTypeKey, meal }
    });
  };

  const handleNotCooked = (dayIndex, mealTypeKey, meal) => {
    setActiveMealModal({
      isOpen: true,
      mode: 'notCooked',
      data: { dayIndex, mealTypeKey, meal }
    });
  };

  const handleChangeMeal = (dayIndex, mealTypeKey, meal) => {
    setActiveMealModal({
      isOpen: true,
      mode: 'change',
      data: { dayIndex, mealTypeKey, meal }
    });
  };

  const handleTriggerReschedule = (dayIndex, mealTypeKey, meal, reason) => {
    setActiveMealModal({ isOpen: false, mode: 'cooked', data: null });
    setActiveRescheduleModal({
      isOpen: true,
      data: { dayIndex, mealTypeKey, meal, reason }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📅 Smart AI Meal Planner</h2>
            <span className="ai-badge">Balanced Nutrition</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Auto-rotates authentic Indian meals, prevents duplicate dishes, and deducts existing kitchen inventory.
          </p>
        </div>

        <button onClick={() => setActiveTab('grocery')} className="btn btn-secondary">
          🛒 Check Synced Grocery List ➔
        </button>
      </div>

      {(!recipes || recipes.length === 0) && (
        <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '14px 18px', color: '#1e40af', fontSize: '0.85rem' }}>
          💡 <strong>Tip:</strong> The recipe catalog currently has no recipes. You can add recipes in the Recipe Management tab or let an administrator add them, and they will be used to generate your meal schedules.
        </div>
      )}

      {/* Generation Control Panel */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Customize & Generate Meal Plan</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Duration</label>
            <select
              className="form-select"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={3}>3 Days (Weekend Sprint)</option>
              <option value={7}>7 Days (Weekly Plan)</option>
              <option value={15}>15 Days (Fortnightly Plan)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">People (Portions)</label>
            <select
              className="form-select"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 People (Standard)</option>
              <option value={3}>3 People</option>
              <option value={4}>4 People (Family)</option>
              <option value={5}>5+ People</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Focus Goal</label>
            <select
              className="form-select"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="Healthy Eating">🥗 Healthy Eating</option>
              <option value="Fitness">💪 Fitness & Protein</option>
              <option value="Weight Management">⚖️ Weight Management</option>
              <option value="Quick Meals">⏱️ Quick Meals</option>
              <option value="Family Meals">👨‍👩‍👧 Family Favorites</option>
              <option value="Senior-Friendly">👴 Senior-Friendly</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Cooking Time</label>
            <select
              className="form-select"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
            >
              <option value={15}>≤ 15 minutes</option>
              <option value={25}>≤ 25 minutes</option>
              <option value={40}>≤ 40 minutes</option>
              <option value={60}>Any Time</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            💡 Inventory-aware: Recipes matching your in-stock pantry items are automatically prioritized.
          </div>
          <button
            onClick={handleGenerate}
            className="btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            ✨ Generate Smart Meal Plan
          </button>
        </div>

        {generationNotice && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>✅</span>
            <span>New {duration}-day meal plan generated! Automatically updated and synced with your grocery list.</span>
          </div>
        )}
      </div>

      {/* Day by Day Plan Columns / Empty State */}
      {(!mealPlan || mealPlan.length === 0) ? (
        <div className="glass-card" style={{
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '3rem' }}>📅</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No meal plan generated yet</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px', lineHeight: 1.5 }}>
            Choose your planning duration and portion count above, then click <strong>"Generate Smart Meal Plan"</strong> to automatically create your weekly meal schedule.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {mealPlan.map((day) => (
            <div
              key={day.dayIndex}
              className="glass-card"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Day Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{day.dayName}</span>
                  <span className="badge badge-neutral">{day.dateLabel}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Home Meals Schedule
                </span>
              </div>

              {/* Meal Slots Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                {['breakfast', 'lunch', 'snack', 'dinner'].map((slotKey) => {
                  const meal = day.meals?.[slotKey];
                  if (!meal) return null;
                  return (
                    <MealCard
                      key={slotKey}
                      meal={meal}
                      dayIndex={day.dayIndex}
                      mealTypeKey={slotKey}
                      onCooked={handleCooked}
                      onNotCooked={handleNotCooked}
                      onChangeMeal={handleChangeMeal}
                      onReschedule={(dayIdx, key, m) =>
                        handleTriggerReschedule(dayIdx, key, m, 'Slot Rescheduled')
                      }
                      onViewRecipe={(recId) => {
                        const r = (recipes || []).find((item) => item.id === recId);
                        if (r) setSelectedRecipe(r);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onMarkCooked={(r) => {
          markMealCooked(0, 'dinner', { rating: 5, review: 'Prepared from meal plan!' });
        }}
      />

      <MealActionModal
        isOpen={activeMealModal.isOpen}
        mode={activeMealModal.mode}
        mealData={activeMealModal.data}
        onClose={() => setActiveMealModal({ isOpen: false, mode: 'cooked', data: null })}
        onSubmitCooked={(ratingData) => {
          markMealCooked(activeMealModal.data.dayIndex, activeMealModal.data.mealTypeKey, ratingData);
        }}
        onSubmitNotCooked={(skipData) => {
          markMealNotCooked(activeMealModal.data.dayIndex, activeMealModal.data.mealTypeKey, skipData);
          handleTriggerReschedule(
            activeMealModal.data.dayIndex,
            activeMealModal.data.mealTypeKey,
            activeMealModal.data.meal,
            skipData.reason
          );
        }}
        onTriggerReschedule={handleTriggerReschedule}
        alternativeRecipes={
          activeMealModal.data
            ? getAlternatives(activeMealModal.data.meal?.recipeId, 'No time')
            : []
        }
        onSelectAlternative={(alt) => {
          changeMealRecipe(activeMealModal.data.dayIndex, activeMealModal.data.mealTypeKey, alt);
        }}
      />

      <RescheduleModal
        isOpen={activeRescheduleModal.isOpen}
        mealData={activeRescheduleModal.data}
        mealPlan={mealPlan || []}
        onClose={() => setActiveRescheduleModal({ isOpen: false, data: null })}
        onConfirmReschedule={(fromDay, fromKey, toDay, toKey) => {
          rescheduleMeal(fromDay, fromKey, toDay, toKey);
        }}
        alternativeRecipes={
          activeRescheduleModal.data
            ? getAlternatives(activeRescheduleModal.data.meal?.recipeId, activeRescheduleModal.data.reason)
            : []
        }
        onSelectAlternative={(alt) => {
          changeMealRecipe(activeRescheduleModal.data.dayIndex, activeRescheduleModal.data.mealTypeKey, alt);
        }}
      />
    </div>
  );
};
