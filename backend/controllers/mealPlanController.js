import { dataStore } from '../models/dataStore.js';

export const getMealPlans = (req, res) => {
  try {
    const plans = dataStore.getMealPlans();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveMealPlans = (req, res) => {
  try {
    const plans = Array.isArray(req.body) ? req.body : [];
    dataStore.saveMealPlans(plans);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMealSlot = (req, res) => {
  try {
    const { dayIndex, slotKey } = req.params;
    const slotData = req.body;
    const plans = dataStore.getMealPlans();
    const dIdx = parseInt(dayIndex, 10);

    if (!plans[dIdx]) {
      return res.status(404).json({ error: 'Day not found in active meal plan' });
    }

    if (!plans[dIdx].meals) plans[dIdx].meals = {};
    plans[dIdx].meals[slotKey] = slotData;

    dataStore.saveMealPlans(plans);
    res.json(plans[dIdx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeMealFromSlot = (req, res) => {
  try {
    const { dayIndex, slotKey } = req.params;
    const plans = dataStore.getMealPlans();
    const dIdx = parseInt(dayIndex, 10);

    if (!plans[dIdx] || !plans[dIdx].meals) {
      return res.status(404).json({ error: 'Meal slot not found' });
    }

    delete plans[dIdx].meals[slotKey];
    dataStore.saveMealPlans(plans);
    res.json({ success: true, day: plans[dIdx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateSmartPlan = (req, res) => {
  try {
    const { durationDays = 7, peopleCount = 2, goal = 'Healthy Eating', maxTime = 30 } = req.body;
    const recipes = dataStore.getRecipes();

    if (!recipes || recipes.length === 0) {
      return res.status(400).json({ error: 'No recipes found in catalog to generate a meal plan' });
    }

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const newPlan = [];

    // Filter recipes by meal category if available
    const breakfastPool = recipes.filter(r => r.mealCategory === 'Breakfast' || r.category === 'Breakfast') || recipes;
    const lunchPool = recipes.filter(r => r.mealCategory === 'Lunch' || r.category === 'Lunch') || recipes;
    const snackPool = recipes.filter(r => r.mealCategory === 'Snacks' || r.category === 'Snacks') || recipes;
    const dinnerPool = recipes.filter(r => r.mealCategory === 'Dinner' || r.category === 'Dinner') || recipes;

    const bList = breakfastPool.length > 0 ? breakfastPool : recipes;
    const lList = lunchPool.length > 0 ? lunchPool : recipes;
    const sList = snackPool.length > 0 ? snackPool : recipes;
    const dList = dinnerPool.length > 0 ? dinnerPool : recipes;

    for (let i = 0; i < durationDays; i++) {
      const bRecipe = bList[i % bList.length];
      const lRecipe = lList[(i + 1) % lList.length];
      const sRecipe = sList[(i + 2) % sList.length];
      const dRecipe = dList[(i + 3) % dList.length];

      newPlan.push({
        dayIndex: i,
        dayName: dayNames[i % 7] + (i >= 7 ? ` (Week ${Math.floor(i / 7) + 1})` : ''),
        dateLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`,
        meals: {
          breakfast: {
            id: `plan-${i}-b`,
            mealType: 'Breakfast',
            time: '08:00 AM',
            recipeId: bRecipe.id,
            recipeName: bRecipe.name,
            status: 'Planned',
            servings: peopleCount
          },
          lunch: {
            id: `plan-${i}-l`,
            mealType: 'Lunch',
            time: '01:00 PM',
            recipeId: lRecipe.id,
            recipeName: lRecipe.name,
            status: 'Planned',
            servings: peopleCount
          },
          snack: {
            id: `plan-${i}-s`,
            mealType: 'Snack',
            time: '05:00 PM',
            recipeId: sRecipe.id,
            recipeName: sRecipe.name,
            status: 'Planned',
            servings: peopleCount
          },
          dinner: {
            id: `plan-${i}-d`,
            mealType: 'Dinner',
            time: '08:00 PM',
            recipeId: dRecipe.id,
            recipeName: dRecipe.name,
            status: 'Planned',
            servings: peopleCount
          }
        }
      });
    }

    dataStore.saveMealPlans(newPlan);
    res.json({ success: true, plan: newPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
