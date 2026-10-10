import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { StatCard } from '../components/common/StatCard';
import { MealCard } from '../components/meal/MealCard';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { RecipeDetailModal } from '../components/recipe/RecipeDetailModal';
import { MealActionModal } from '../components/meal/MealActionModal';
import { RescheduleModal } from '../components/meal/RescheduleModal';
import { ExpiryWarningBanner } from '../components/inventory/ExpiryWarningBanner';
import { suggestAlternativeRecipes } from '../services/aiEngine';
import { Modal } from '../components/common/Modal';
import { apiService } from '../services/api';

export const UserDashboard = ({ setActiveTab }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const {
    mealPlan,
    inventory,
    recipes,
    groceryList,
    analyticsData,
    getExpiringItems,
    feedbackList,
    markMealCooked,
    markMealNotCooked,
    rescheduleMeal,
    changeMealRecipe
  } = useAppState();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeMealModal, setActiveMealModal] = useState({ isOpen: false, mode: 'cooked', data: null });
  const [activeRescheduleModal, setActiveRescheduleModal] = useState({ isOpen: false, data: null });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    ageGroup: currentUser?.ageGroup || '26-35',
    foodPreference: currentUser?.foodPreference || 'South Indian & North Indian Mix',
    dietaryPreference: currentUser?.dietaryPreference || 'Vegetarian (Eggs Allowed)',
    primaryGoal: currentUser?.primaryGoal || 'Healthy Eating'
  });

  const expiringItems = getExpiringItems();
  const todayPlan = mealPlan && mealPlan.length > 0 ? mealPlan[0] : null;
  const tomorrowPlan = mealPlan && mealPlan.length > 1 ? mealPlan[1] : null;

  const pendingGroceryItems = (groceryList || []).filter(g => !g.purchased);

  const getAlternatives = (currentRecipeId, reason = 'No time') => {
    return suggestAlternativeRecipes(
      recipes || [],
      currentRecipeId,
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    if (currentUser?.id) {
      try {
        await apiService.updateProfile(currentUser.id, profileForm);
      } catch (err) { }
    }
    setIsProfileModalOpen(false);
    alert('User preferences updated successfully!');
  };

  // Recommended recipes tailored to personal goal
  const recommendedRecipes = (recipes || []).filter(
    r => r.goalTags?.includes(currentUser?.primaryGoal || 'Healthy Eating') || (r.rating && r.rating >= 4.8)
  ).slice(0, 3);

  return (
    <div className="user-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Welcome Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome back, {currentUser?.name?.split(' ')[0] || 'User'} 👋
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Diet: <strong>{currentUser?.dietaryPreference || 'Vegetarian'}</strong> • Goal:{' '}
            <strong>{currentUser?.primaryGoal || 'Healthy Eating'}</strong> • Preference:{' '}
            <strong>{currentUser?.foodPreference || 'South & North Indian'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsProfileModalOpen(true)} className="btn btn-secondary btn-sm">
            ⚙️ Edit Preferences
          </button>
          <button onClick={() => setActiveTab('recipes')} className="btn btn-primary btn-sm">
            🤖 AI Recipe Match
          </button>
        </div>
      </div>

      {/* Expiry Banner (Only shown when items are nearing expiry) */}
      {expiringItems.length > 0 && (
        <ExpiryWarningBanner
          expiringItems={expiringItems}
          onFindRecipes={() => setActiveTab('recipes')}
        />
      )}

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Meals Planned"
          value={analyticsData.totalMealsPlanned}
          subtitle={analyticsData.totalMealsPlanned > 0 ? "Active schedule" : "No plan created"}
          icon="📅"
          iconBg="#dbeafe"
          trend={analyticsData.totalMealsPlanned > 0 ? "Active" : "Empty"}
          trendColor="#1d4ed8"
        />
        <StatCard
          title="Meal Completion"
          value={`${analyticsData.completionRate}%`}
          subtitle={`${analyticsData.completedMeals} cooked, ${analyticsData.skippedMeals} skipped`}
          icon="✅"
          iconBg="#d1fae5"
          trend={analyticsData.completedMeals > 0 ? "Logged" : "Pending"}
          trendColor="#059669"
        />
        <StatCard
          title="Grocery Deficit"
          value={pendingGroceryItems.length}
          subtitle="Items needed for plan"
          icon="🛒"
          iconBg="#fef3c7"
          trend="Pantry-deducted"
          trendColor="#d97706"
        />
        <StatCard
          title="Kitchen Inventory"
          value={(inventory || []).length}
          subtitle={`${expiringItems.length} expiring in 48h`}
          icon="📦"
          iconBg="#ede9fe"
          trend="In Stock"
          trendColor="#7c3aed"
        />
      </div>

      {/* Today's Meal Schedule */}
      <div className="glass-card dashboard-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Today's Planned Meals</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {todayPlan ? `${todayPlan.dayName} • Click "Cooked" to record feedback or "Not Cooked" for alternative suggestions` : 'No meal plan scheduled for today'}
            </p>
          </div>
          {todayPlan && <span className="badge badge-success">Schedule Active</span>}
        </div>

        {todayPlan && todayPlan.meals ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {['breakfast', 'lunch', 'dinner'].map((slotKey) => {
              const meal = todayPlan.meals?.[slotKey];
              if (!meal) return null;
              return (
                <MealCard
                  key={slotKey}
                  meal={meal}
                  dayIndex={0}
                  mealTypeKey={slotKey}
                  onCooked={handleCooked}
                  onNotCooked={handleNotCooked}
                  onChangeMeal={handleChangeMeal}
                  onReschedule={(dayIdx, key, m) => handleTriggerReschedule(dayIdx, key, m, 'Manual Reschedule')}
                  onViewRecipe={(recId) => {
                    const r = (recipes || []).find(item => item.id === recId || item.name === meal.recipeName);
                    if (r) setSelectedRecipe(r);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1'
          }}>
            <span style={{ fontSize: '2.5rem' }}>📅</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No meals planned for today</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
              Generate your personalized weekly meal rotation in the Meal Planner.
            </p>
            <button onClick={() => setActiveTab('planner')} className="btn btn-primary btn-sm" style={{ marginTop: '6px' }}>
              📅 Create Smart Meal Plan
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Meals & Grocery Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Upcoming Meals Preview (Tomorrow) */}
        <div className="glass-card dashboard-section" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Upcoming Meals Preview</h4>
            <button onClick={() => setActiveTab('planner')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              View 7-Day Plan ➔
            </button>
          </div>

          {tomorrowPlan && tomorrowPlan.meals ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['breakfast', 'lunch', 'dinner'].map((slot) => {
                const m = tomorrowPlan.meals[slot];
                if (!m) return null;
                return (
                  <div
                    key={slot}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {tomorrowPlan.dayName} {slot}
                      </span>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '2px 0 0 0' }}>{m.recipeName}</h5>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.time}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#64748b', padding: '16px 0' }}>
              No upcoming meals scheduled for tomorrow.
            </p>
          )}
        </div>

        {/* Grocery Summary */}
        <div className="glass-card dashboard-section" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Grocery Status Summary</h4>
            <button onClick={() => setActiveTab('grocery')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              Open Grocery List ➔
            </button>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.82rem',
            color: '#065f46'
          }}>
            Net deficit calculated from active meal plan with your kitchen inventory deducted.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Total Items Needed:</span>
              <strong>{(groceryList || []).length} items</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Pending Purchase:</span>
              <strong style={{ color: pendingGroceryItems.length > 0 ? '#2563eb' : '#10b981' }}>
                {pendingGroceryItems.length} items
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '6px 0' }}>
              <span>Purchased / In Hand:</span>
              <strong style={{ color: '#10b981' }}>
                {(groceryList || []).filter(g => g.purchased).length} items
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Recipes Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recommended For You</h3>
              <span className="ai-badge">Personalized AI</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Curated dishes aligning with your goal <strong>{currentUser?.primaryGoal || 'Healthy Eating'}</strong> and pantry stock.
            </p>
          </div>
          <button onClick={() => setActiveTab('recipes')} className="btn btn-outline btn-sm">
            View All Recipes ➔
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
          {recommendedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showMatch={true}
              onSelect={(r) => setSelectedRecipe(r)}
              onQuickCook={(r) => {
                handleCooked(0, 'dinner', { recipeId: r.id, recipeName: r.name, mealType: 'Dinner' });
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Meal Feedback Log */}
      <div className="glass-card dashboard-section" style={{ padding: '22px' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Recent Cooking Feedback</h4>
        {feedbackList.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            No cooking reviews logged yet. Once you mark a meal as "Cooked", your feedback will appear here to fine-tune AI recommendations.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedbackList.slice(0, 3).map((fb) => (
              <div
                key={fb.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{fb.recipeName}</strong>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    "{fb.comment || 'Cooked as scheduled'}"
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                    {'★'.repeat(fb.rating || 5)}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{fb.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile & Basic Preferences Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="👤 User Profile & Food Preferences"
        maxWidth="520px"
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Age Group</label>
            <select
              className="form-select"
              value={profileForm.ageGroup}
              onChange={(e) => setProfileForm({ ...profileForm, ageGroup: e.target.value })}
            >
              <option value="18-25">18-25 years (Student / Young Adult)</option>
              <option value="26-35">26-35 years (Working Professional)</option>
              <option value="36-50">36-50 years (Family Nutrition)</option>
              <option value="50+">50+ years (Senior-Friendly)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Food Preference (Cuisine Style)</label>
            <select
              className="form-select"
              value={profileForm.foodPreference}
              onChange={(e) => setProfileForm({ ...profileForm, foodPreference: e.target.value })}
            >
              <option value="South Indian">South Indian (Idli, Dosa, Sambar, Rice)</option>
              <option value="North Indian">North Indian (Rotis, Dal Tadka, Khichdi, Curries)</option>
              <option value="South Indian & North Indian Mix">South Indian & North Indian Mix</option>
              <option value="Quick Home Food">Quick & Easy Home Cooking</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Dietary Preference</label>
            <select
              className="form-select"
              value={profileForm.dietaryPreference}
              onChange={(e) => setProfileForm({ ...profileForm, dietaryPreference: e.target.value })}
            >
              <option value="Vegetarian">Strict Vegetarian</option>
              <option value="Vegetarian (Eggs Allowed)">Vegetarian (Eggs Allowed)</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Healthy / Diet Focus">Healthy / Low-Oil Diet</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Primary Goal</label>
            <select
              className="form-select"
              value={profileForm.primaryGoal}
              onChange={(e) => setProfileForm({ ...profileForm, primaryGoal: e.target.value })}
            >
              <option value="Healthy Eating">🥗 Healthy Eating & Balanced Meals</option>
              <option value="Fitness">💪 Fitness & High Protein</option>
              <option value="Weight Management">⚖️ Weight Management</option>
              <option value="Quick & Easy">⏱️ Quick & Easy (≤20 min)</option>
              <option value="Family Meals">👨‍👩‍👧 Family Favorite Meals</option>
              <option value="Senior-Friendly">👴 Senior-Friendly Comfort Food</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsProfileModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Save Preferences
            </button>
          </div>
        </form>
      </Modal>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onMarkCooked={(r) => {
          handleCooked(0, 'dinner', { recipeId: r.id, recipeName: r.name, mealType: 'Dinner' });
        }}
      />

      {/* Meal Cooked/Skip Action Modal */}
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

      {/* Reschedule Modal */}
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
