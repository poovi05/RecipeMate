import { dataStore } from '../models/dataStore.js';

export const getRecipes = (req, res) => {
  try {
    let recipes = dataStore.getRecipes();
    const { category, diet, search, maxTime } = req.query;

    if (search) {
      const q = search.toLowerCase();
      recipes = recipes.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(q)))
      );
    }

    if (category && category !== 'All') {
      recipes = recipes.filter(r =>
        r.category === category ||
        r.regionalCategory === category ||
        r.mealCategory === category
      );
    }

    if (diet && diet !== 'All') {
      recipes = recipes.filter(r =>
        r.dietCategory === diet ||
        r.dietType === diet ||
        (diet === 'Vegetarian' && (r.dietType === 'Vegetarian' || r.dietCategory === 'Vegetarian'))
      );
    }

    if (maxTime) {
      recipes = recipes.filter(r => r.cookingTime <= parseInt(maxTime, 10));
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecipeById = (req, res) => {
  try {
    const recipes = dataStore.getRecipes();
    const recipe = recipes.find(r => r.id === req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createRecipe = (req, res) => {
  try {
    const {
      name,
      category,
      regionalCategory,
      mealCategory,
      dietCategory,
      dietType,
      cookingTime,
      difficulty,
      servings,
      calories,
      protein,
      imageEmoji,
      ingredients,
      steps,
      goalTags
    } = req.body;

    if (!name || !ingredients || !steps) {
      return res.status(400).json({ error: 'Name, ingredients, and steps are required' });
    }

    const recipes = dataStore.getRecipes();
    const newRecipe = {
      id: `rec-${Date.now()}`,
      name,
      category: category || mealCategory || 'Lunch',
      regionalCategory: regionalCategory || 'South Indian',
      mealCategory: mealCategory || category || 'Lunch',
      dietCategory: dietCategory || (dietType === 'Vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'),
      dietType: dietType || (dietCategory === 'Vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'),
      cookingTime: Number(cookingTime) || 20,
      difficulty: difficulty || 'Easy',
      servings: Number(servings) || 2,
      calories: Number(calories) || 250,
      protein: protein || '10g',
      imageEmoji: imageEmoji || '🍲',
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      goalTags: goalTags || ['Healthy Eating'],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      steps: Array.isArray(steps) ? steps : []
    };

    recipes.unshift(newRecipe);
    dataStore.saveRecipes(recipes);
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRecipe = (req, res) => {
  try {
    const recipes = dataStore.getRecipes();
    const idx = recipes.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Recipe not found' });

    recipes[idx] = { ...recipes[idx], ...req.body };
    dataStore.saveRecipes(recipes);
    res.json(recipes[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRecipe = (req, res) => {
  try {
    let recipes = dataStore.getRecipes();
    recipes = recipes.filter(r => r.id !== req.params.id);
    dataStore.saveRecipes(recipes);
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
