import { dataStore } from '../models/dataStore.js';

const INGREDIENT_CATEGORY_MAP = {
  // Vegetables
  'tomato': 'Vegetables', 'onion': 'Vegetables', 'green chilli': 'Vegetables',
  'potato': 'Vegetables', 'spinach (palak)': 'Vegetables', 'spinach': 'Vegetables',
  'carrot': 'Vegetables', 'cauliflower (gobi)': 'Vegetables', 'cauliflower': 'Vegetables',
  'fresh coriander': 'Vegetables', 'coriander': 'Vegetables', 'ginger': 'Vegetables',
  'garlic': 'Vegetables', 'lemon': 'Vegetables', 'curry leaves': 'Vegetables',

  // Fruits
  'apple': 'Fruits', 'banana': 'Fruits', 'orange': 'Fruits', 'mango': 'Fruits',

  // Grains
  'rice': 'Grains', 'toor dal': 'Grains', 'moong dal': 'Grains', 'chana dal': 'Grains',
  'urad dal': 'Grains', 'poha (flattened rice)': 'Grains', 'poha': 'Grains',
  'semolina (rava)': 'Grains', 'rava': 'Grains', 'wheat flour': 'Grains',
  'atta': 'Grains', 'idli batter': 'Grains', 'foxnuts (makhana)': 'Grains',

  // Dairy
  'paneer (cottage cheese)': 'Dairy', 'paneer': 'Dairy', 'curd / yogurt': 'Dairy',
  'curd': 'Dairy', 'milk': 'Dairy', 'butter': 'Dairy', 'ghee': 'Dairy',

  // Spices
  'mustard seeds': 'Spices', 'turmeric powder': 'Spices', 'turmeric': 'Spices',
  'cumin seeds': 'Spices', 'sambar powder': 'Spices', 'ginger garlic paste': 'Spices',
  'tamarind': 'Spices', 'salt': 'Spices', 'red chilli powder': 'Spices',
  'coriander powder': 'Spices', 'garam masala': 'Spices', 'cooking oil': 'Spices',

  // Meat/Egg
  'egg': 'Meat/Egg', 'chicken': 'Meat/Egg', 'mutton': 'Meat/Egg', 'fish': 'Meat/Egg'
};

const getCategoryForIngredient = (ingName) => {
  const norm = ingName.toLowerCase().trim();
  for (const [key, cat] of Object.entries(INGREDIENT_CATEGORY_MAP)) {
    if (norm.includes(key) || key.includes(norm)) return cat;
  }
  return 'Other';
};

export const getGrocery = (req, res) => {
  try {
    const list = dataStore.getGrocery();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveGrocery = (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      dataStore.saveGrocery(req.body);
      return res.json(req.body);
    }
    const list = dataStore.getGrocery();
    const newItem = {
      id: `groc-${Date.now()}`,
      purchased: false,
      demand: req.body.quantityToBuy || req.body.demand || 1,
      inStock: 0,
      estimatedCost: req.body.estimatedCost || 30,
      category: req.body.category || getCategoryForIngredient(req.body.name || ''),
      ...req.body
    };
    list.unshift(newItem);
    dataStore.saveGrocery(list);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGroceryItem = (req, res) => {
  try {
    const list = dataStore.getGrocery();
    const idx = list.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Grocery item not found' });

    list[idx] = { ...list[idx], ...req.body };
    dataStore.saveGrocery(list);
    res.json(list[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGroceryItem = (req, res) => {
  try {
    let list = dataStore.getGrocery();
    list = list.filter(g => g.id !== req.params.id);
    dataStore.saveGrocery(list);
    res.json({ success: true, message: 'Grocery item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCompletedItems = (req, res) => {
  try {
    let list = dataStore.getGrocery();
    const remaining = list.filter(g => !g.purchased);
    dataStore.saveGrocery(remaining);
    res.json({ success: true, countRemoved: list.length - remaining.length, grocery: remaining });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateFromMealPlan = (req, res) => {
  try {
    const mealPlans = dataStore.getMealPlans();
    const recipes = dataStore.getRecipes();
    const inventory = dataStore.getInventory();

    const ingredientDemands = {};

    mealPlans.forEach(day => {
      Object.values(day.meals || {}).forEach(meal => {
        if (!meal || !meal.recipeId || meal.status === 'Skipped') return;
        const recipe = recipes.find(r => r.id === meal.recipeId || r.name === meal.recipeName);
        if (!recipe || !recipe.ingredients) return;

        const factor = (meal.servings || 2) / (recipe.servings || 2);

        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase().trim();
          if (!ingredientDemands[key]) {
            ingredientDemands[key] = {
              originalName: ing.name,
              totalAmount: 0,
              unit: ing.unit,
              category: getCategoryForIngredient(ing.name)
            };
          }
          ingredientDemands[key].totalAmount += (Number(ing.amount) || 1) * factor;
        });
      });
    });

    // Net Deficit: Deduct in-stock inventory
    const generatedGrocery = [];
    Object.entries(ingredientDemands).forEach(([normKey, demand]) => {
      const invMatch = inventory.find(i => i.name.toLowerCase().trim() === normKey);
      const inStock = invMatch ? Number(invMatch.quantity) || 0 : 0;
      const deficit = demand.totalAmount - inStock;

      if (deficit > 0) {
        generatedGrocery.push({
          id: `groc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: demand.originalName,
          category: demand.category,
          quantityToBuy: Number(deficit.toFixed(1)),
          demand: Number(demand.totalAmount.toFixed(1)),
          inStock,
          unit: demand.unit,
          purchased: false,
          estimatedCost: Math.max(15, Math.round(deficit * 20))
        });
      }
    });

    dataStore.saveGrocery(generatedGrocery);
    res.json({
      success: true,
      count: generatedGrocery.length,
      grocery: generatedGrocery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
