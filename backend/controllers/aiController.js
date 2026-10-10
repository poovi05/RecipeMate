import { dataStore } from '../models/dataStore.js';

const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/s$/, ''); // singularize
};

export const getRecommendations = (req, res) => {
  try {
    const {
      availableIngredients = [],
      dietaryPreference,
      foodPreference,
      mealType,
      maxCookingTime,
      goal,
      recentCookedNames = []
    } = req.body;

    const recipes = dataStore.getRecipes();
    const feedbackList = dataStore.getFeedback();
    const normalizedAvailable = (availableIngredients || []).map(normalize);

    const scored = recipes.map((recipe) => {
      let score = 0;
      const reasons = [];

      // 1. Available Ingredients Match
      const matchedIngs = [];
      const missingIngs = [];

      recipe.ingredients.forEach((ing) => {
        const norm = normalize(ing.name);
        const hasIt = normalizedAvailable.some(avail => avail.includes(norm) || norm.includes(avail));
        if (hasIt) matchedIngs.push(ing);
        else missingIngs.push(ing);
      });

      const matchRatio = recipe.ingredients.length > 0 ? matchedIngs.length / recipe.ingredients.length : 0;
      if (normalizedAvailable.length > 0) {
        score += matchRatio * 50;
        if (matchedIngs.length > 0) {
          reasons.push(`Uses ${matchedIngs.length} of your in-stock pantry items (${matchedIngs.map(i => i.name).slice(0, 3).join(', ')})`);
        }
        if (missingIngs.length === 0) {
          score += 20;
          reasons.push('You have 100% of required ingredients (Ready to cook immediately)');
        }
      } else {
        score += (recipe.rating || 4.5) * 8;
      }

      // 2. Dietary Preference Alignment
      if (dietaryPreference) {
        const prefNorm = dietaryPreference.toLowerCase();
        if (prefNorm.includes('veg') && !prefNorm.includes('non')) {
          if (recipe.dietType === 'Vegetarian' || recipe.dietCategory === 'Vegetarian') {
            score += 20;
            reasons.push(`Matches your ${dietaryPreference} dietary preference`);
          } else if (recipe.dietCategory === 'Egg' && prefNorm.includes('egg')) {
            score += 15;
            reasons.push('Contains egg, aligned with your permitted diet');
          } else {
            score -= 60; // strongly penalize meat for vegetarians
          }
        } else if (prefNorm.includes('non-veg')) {
          if (recipe.dietCategory === 'Non-Vegetarian' || recipe.dietType === 'Non-Vegetarian') {
            score += 15;
          }
        }
      }

      // 3. Meal Type Alignment
      if (mealType && mealType !== 'All') {
        if (
          recipe.mealCategory === mealType ||
          recipe.category === mealType ||
          recipe.regionalCategory === mealType
        ) {
          score += 15;
          reasons.push(`Tailored specifically for ${mealType}`);
        }
      }

      // 4. Cooking Time Constraint
      if (maxCookingTime && recipe.cookingTime <= Number(maxCookingTime)) {
        score += 10;
        reasons.push(`Cooking time is only ${recipe.cookingTime} mins (within your ≤${maxCookingTime} min preference)`);
      }

      // 5. Goal Alignment
      if (goal && recipe.goalTags && recipe.goalTags.includes(goal)) {
        score += 15;
        reasons.push(`Supports your primary health goal: "${goal}"`);
      }

      // 6. Previous Meal Feedback Boost / Penalty
      const matchingFeedback = feedbackList.filter(f => f.recipeName === recipe.name);
      if (matchingFeedback.length > 0) {
        const avgRating = matchingFeedback.reduce((acc, curr) => acc + (curr.rating || 4), 0) / matchingFeedback.length;
        if (avgRating >= 4.5) {
          score += 10;
          reasons.push('Previously rated 5 stars by you');
        }
      }

      // 7. Avoid Immediate Repetition
      if (recentCookedNames.includes(recipe.name)) {
        score -= 25; // penalize if prepared in the last 2 days
      }

      const matchPercentage = Math.round(matchRatio * 100);

      return {
        ...recipe,
        aiScore: Math.round(score),
        matchData: {
          matchedCount: matchedIngs.length,
          totalRequired: recipe.ingredients.length,
          matchPercentage,
          matched: matchedIngs,
          missing: missingIngs,
          canCookNow: missingIngs.length === 0
        },
        recommendationReason: reasons.length > 0
          ? `Recommended because: ${reasons.join('; ')}.`
          : 'Recommended based on high overall rating and authentic preparation.'
      };
    });

    scored.sort((a, b) => b.aiScore - a.aiScore);

    res.json({
      success: true,
      totalEvaluated: recipes.length,
      recommendations: scored
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const suggestAlternative = (req, res) => {
  try {
    const { currentRecipeId, reason, availableIngredients = [] } = req.body;
    const recipes = dataStore.getRecipes();

    const current = recipes.find(r => r.id === currentRecipeId);
    const candidates = recipes.filter(r => r.id !== currentRecipeId);
    const normalizedAvailable = (availableIngredients || []).map(normalize);

    const scored = candidates.map(recipe => {
      let score = 50;
      let altReason = '';

      const matched = recipe.ingredients.filter(ing => {
        const n = normalize(ing.name);
        return normalizedAvailable.some(avail => avail.includes(n) || n.includes(avail));
      });

      if (reason === 'No time' || reason === "Didn't have time") {
        if (recipe.cookingTime <= 15) {
          score += 45;
          altReason = `Fast alternative ready in just ${recipe.cookingTime} mins!`;
        } else if (recipe.cookingTime <= 20) {
          score += 25;
          altReason = `Speedy dish taking only ${recipe.cookingTime} mins.`;
        }
        if (recipe.difficulty === 'Easy') score += 15;
      } else if (reason === 'No ingredients' || reason === "Didn't have ingredients") {
        score += matched.length * 15;
        if (matched.length === recipe.ingredients.length) {
          score += 35;
          altReason = 'Uses 100% of your current pantry stock!';
        } else {
          altReason = `Uses ${matched.length} ingredients you already have.`;
        }
      } else if (reason === "Didn't like the recipe" || reason === "Didn't like it") {
        if (current && recipe.category !== current.category) score += 25;
        score += (recipe.rating || 4) * 8;
        altReason = `Different flavor profile with high ${recipe.rating} rating.`;
      } else {
        score += (recipe.rating || 4) * 8;
        altReason = 'Wholesome staple recommended by RecipeMate AI.';
      }

      return {
        ...recipe,
        altScore: score,
        alternativeReason: altReason,
        matchData: {
          matchedCount: matched.length,
          totalRequired: recipe.ingredients.length
        }
      };
    });

    scored.sort((a, b) => b.altScore - a.altScore);

    res.json({
      success: true,
      alternatives: scored.slice(0, 4)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
