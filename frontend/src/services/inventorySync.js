import { normalizeIngredient } from './aiEngine';

/**
 * Intelligent Net-Deficit Grocery Generator
 * Analyzes all recipes in the active meal plan, tallies total ingredients required,
 * matches with user's pantry/fridge inventory, and ONLY lists the net deficit needed!
 */
export const generateNetDeficitGroceryList = (mealPlan, allRecipes, currentInventory, peopleCount = 2) => {
  // Scale factor based on people (base servings in recipe is typically 2)
  const scale = peopleCount / 2;

  // 1. Aggregate all ingredients required across the entire plan
  const demandMap = {};

  mealPlan.forEach((day) => {
    Object.values(day.meals).forEach((meal) => {
      if (!meal || !meal.recipeId) return;
      const recipe = allRecipes.find((r) => r.id === meal.recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach((ing) => {
        const normName = normalizeIngredient(ing.name);
        if (!demandMap[normName]) {
          demandMap[normName] = {
            displayName: ing.name,
            totalRequired: 0,
            unit: ing.unit || 'pcs',
            category: guessCategory(ing.name)
          };
        }
        demandMap[normName].totalRequired += (ing.amount || 1) * scale;
      });
    });
  });

  // 2. Check against inventory and calculate deficit
  const groceryItems = [];

  Object.entries(demandMap).forEach(([normName, item]) => {
    // Look up in inventory
    const inStock = currentInventory.find((inv) => {
      const normInv = normalizeIngredient(inv.name);
      return normInv.includes(normName) || normName.includes(normInv);
    });

    let availableQty = 0;
    if (inStock) {
      // Normalize units if needed (kg to g, etc.)
      availableQty = convertToComparableUnit(inStock.quantity, inStock.unit, item.unit);
    }

    const deficit = item.totalRequired - availableQty;

    // Even if deficit is 0 or negative, we don't need to purchase!
    if (deficit > 0) {
      groceryItems.push({
        id: `groc-${normName}-${Date.now()}`,
        name: item.displayName,
        category: item.category,
        demand: roundNumber(item.totalRequired),
        inStock: roundNumber(availableQty),
        quantityToBuy: roundNumber(deficit),
        unit: item.unit,
        purchased: false,
        estimatedCost: estimateIngredientCost(item.displayName, deficit, item.unit)
      });
    }
  });

  return groceryItems;
};

const convertToComparableUnit = (qty, fromUnit, toUnit) => {
  if (!fromUnit || !toUnit) return qty;
  const f = fromUnit.toLowerCase();
  const t = toUnit.toLowerCase();

  if (f === t) return qty;

  // kg to g
  if (f === 'kg' && t === 'g') return qty * 1000;
  // g to kg
  if (f === 'g' && t === 'kg') return qty / 1000;
  // L to ml
  if (f === 'l' && t === 'ml') return qty * 1000;
  // ml to L
  if (f === 'ml' && t === 'l') return qty / 1000;

  return qty;
};

const roundNumber = (num) => {
  return Math.round(num * 10) / 10;
};

const guessCategory = (name) => {
  const n = name.toLowerCase();
  if (n.includes('rice') || n.includes('dal') || n.includes('flour') || n.includes('rava') || n.includes('semolina')) {
    return 'Grains & Pulses';
  }
  if (n.includes('egg') || n.includes('chicken') || n.includes('moong')) {
    return 'Protein';
  }
  if (n.includes('curd') || n.includes('paneer') || n.includes('milk') || n.includes('ghee')) {
    return 'Dairy';
  }
  if (n.includes('oil') || n.includes('masala') || n.includes('seeds') || n.includes('powder') || n.includes('pepper') || n.includes('salt')) {
    return 'Spices & Staples';
  }
  return 'Vegetables';
};

const estimateIngredientCost = (name, qty, unit) => {
  // Approximate Indian retail pricing estimation for display
  const n = name.toLowerCase();
  let baseRate = 20; // default ₹20
  if (n.includes('paneer')) baseRate = 80;
  else if (n.includes('egg')) baseRate = 7 * qty;
  else if (n.includes('toor dal')) baseRate = 45;
  else if (n.includes('tomato')) baseRate = 25;
  else if (n.includes('onion')) baseRate = 30;
  else if (n.includes('rice')) baseRate = 50;
  
  return Math.round(baseRate);
};
