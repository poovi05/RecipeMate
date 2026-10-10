/**
 * RecipeMate AI Recommendation & Personalization Engine
 * Rule-based intelligent matching algorithm for ingredient availability,
 * dietary goals, time constraints, and user historical preferences.
 */

export const normalizeIngredient = (name) => {
  return name.toLowerCase().trim().replace(/s$/, ''); // basic singularization
};

export const calculateIngredientMatch = (recipe, availableIngredientNames) => {
  const normalizedAvailable = availableIngredientNames.map(normalizeIngredient);
  const matched = [];
  const missing = [];

  recipe.ingredients.forEach((ing) => {
    const normIng = normalizeIngredient(ing.name);
    const isAvailable = normalizedAvailable.some((avail) => 
      avail.includes(normIng) || normIng.includes(avail)
    );

    if (isAvailable) {
      matched.push(ing);
    } else {
      missing.push(ing);
    }
  });

  const totalRequired = recipe.ingredients.length;
  const matchRatio = totalRequired > 0 ? matched.length / totalRequired : 0;

  return {
    matchedCount: matched.length,
    totalRequired,
    matchPercentage: Math.round(matchRatio * 100),
    matched,
    missing,
    canCookNow: missing.length === 0
  };
};

export const getRecipeRecommendations = (recipes, selectedIngredients = [], goalFilter = null, preferences = {}) => {
  if (!recipes || recipes.length === 0) return [];

  const evaluated = recipes.map((recipe) => {
    const matchData = calculateIngredientMatch(recipe, selectedIngredients);
    let aiScore = 0;

    // 1. Core Ingredient Match Weight (0 to 60 points)
    if (selectedIngredients.length > 0) {
      aiScore += (matchData.matchedCount / recipe.ingredients.length) * 60;
      // Bonus if user has all ingredients
      if (matchData.canCookNow) aiScore += 15;
    } else {
      // If no ingredients selected, base score on rating
      aiScore += (recipe.rating || 4.5) * 10;
    }

    // 2. Goal Alignment (0 to 20 points)
    if (goalFilter && recipe.goalTags) {
      if (recipe.goalTags.includes(goalFilter)) {
        aiScore += 20;
      }
      // Specific goal logic
      if (goalFilter === 'Quick & Easy' && recipe.cookingTime <= 20) {
        aiScore += 10;
      }
      if (goalFilter === 'Fitness' && parseInt(recipe.protein) >= 12) {
        aiScore += 10;
      }
      if (goalFilter === 'Weight Management' && recipe.calories <= 280) {
        aiScore += 10;
      }
    }

    // 3. User Preference Alignment
    if (preferences.dietaryPreference && preferences.dietaryPreference.includes('Vegetarian')) {
      if (recipe.dietType === 'Vegetarian') {
        aiScore += 5;
      }
    }

    return {
      ...recipe,
      matchData,
      aiScore: Math.round(aiScore)
    };
  });

  // Sort descending: highest AI score and match count first
  return evaluated.sort((a, b) => {
    if (selectedIngredients.length > 0) {
      if (b.matchData.matchedCount !== a.matchData.matchedCount) {
        return b.matchData.matchedCount - a.matchData.matchedCount;
      }
    }
    return b.aiScore - a.aiScore;
  });
};

/**
 * Intelligent Alternative Recipe Suggestion based on skip reason
 */
export const suggestAlternativeRecipes = (recipes, currentRecipeId, reason, availableIngredients = []) => {
  const current = recipes.find(r => r.id === currentRecipeId);
  const candidates = recipes.filter(r => r.id !== currentRecipeId);

  return candidates.map(recipe => {
    let score = 50;
    const matchData = calculateIngredientMatch(recipe, availableIngredients);

    if (reason === 'No time' || reason === 'Too difficult') {
      if (recipe.cookingTime <= 15) score += 40;
      else if (recipe.cookingTime <= 20) score += 20;
      if (recipe.difficulty === 'Easy') score += 15;
    } else if (reason === 'No ingredients' || reason === 'Ingredients unavailable') {
      score += matchData.matchedCount * 15;
      if (matchData.canCookNow) score += 30;
    } else if (reason === "Didn't like it" || reason === "Don't like it") {
      // Suggest different category or high rated
      if (current && recipe.category !== current.category) score += 25;
      score += (recipe.rating || 4) * 5;
    } else {
      score += (recipe.rating || 4) * 8;
    }

    return {
      ...recipe,
      matchData,
      altScore: score
    };
  }).sort((a, b) => b.altScore - a.altScore).slice(0, 4);
};

/**
 * Expiry-Aware Recipe Suggestion
 * Finds recipes that specifically utilize items nearing expiration
 */
export const getExpiringIngredientRecipes = (recipes, expiringItemNames = []) => {
  if (!expiringItemNames || expiringItemNames.length === 0) return [];

  const matchingRecipes = recipes.filter(recipe => {
    return recipe.ingredients.some(ing => 
      expiringItemNames.some(exp => 
        normalizeIngredient(exp).includes(normalizeIngredient(ing.name)) ||
        normalizeIngredient(ing.name).includes(normalizeIngredient(exp))
      )
    );
  });

  return matchingRecipes.map(recipe => {
    const usedExpiring = recipe.ingredients
      .filter(ing => expiringItemNames.some(exp => 
        normalizeIngredient(exp).includes(normalizeIngredient(ing.name)) ||
        normalizeIngredient(ing.name).includes(normalizeIngredient(exp))
      ))
      .map(i => i.name);

    return {
      ...recipe,
      usedExpiring,
      urgencyLevel: 'High'
    };
  });
};
