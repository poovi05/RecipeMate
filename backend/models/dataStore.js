import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SEED_USERS,
  SEED_RECIPES,
  SEED_INVENTORY,
  SEED_CATEGORIES,
  SEED_NOTIFICATIONS,
  SEED_FEEDBACK
} from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

class DataStore {
  constructor() {
    this.ensureDataDirectory();
    this.store = this.loadStore();
  }

  ensureDataDirectory() {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  getInitialSeed() {
    // Generate an initial 7-day meal plan from the seed recipes
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sampleMealPlans = days.map((dayName, idx) => {
      const bRecipe = SEED_RECIPES[idx % 3]; // breakfast dishes
      const lRecipe = SEED_RECIPES[(idx % 3) + 3]; // lunch dishes
      const dRecipe = SEED_RECIPES[(idx % 3) + 6]; // dinner dishes
      return {
        dayIndex: idx,
        dayName,
        dateLabel: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`,
        meals: {
          breakfast: {
            id: `plan-${idx}-b`,
            mealType: 'Breakfast',
            time: '08:00 AM',
            recipeId: bRecipe?.id || 'rec-3',
            recipeName: bRecipe?.name || 'Vegetable Poha with Roasted Peanuts',
            status: idx === 0 ? 'Cooked' : 'Planned',
            servings: 2
          },
          lunch: {
            id: `plan-${idx}-l`,
            mealType: 'Lunch',
            time: '01:00 PM',
            recipeId: lRecipe?.id || 'rec-2',
            recipeName: lRecipe?.name || 'Classic Toor Dal Sambar with Steamed Rice',
            status: 'Planned',
            servings: 2
          },
          snack: {
            id: `plan-${idx}-s`,
            mealType: 'Snack',
            time: '05:00 PM',
            recipeId: 'rec-12',
            recipeName: 'Spiced Roasted Makhana',
            status: 'Planned',
            servings: 2
          },
          dinner: {
            id: `plan-${idx}-d`,
            mealType: 'Dinner',
            time: '08:00 PM',
            recipeId: dRecipe?.id || 'rec-4',
            recipeName: dRecipe?.name || 'Moong Dal Khichdi with Curd',
            status: 'Planned',
            servings: 2
          }
        }
      };
    });

    // Initial Grocery items with net deficit
    const sampleGrocery = [
      { id: 'groc-1', name: 'Spinach (Palak)', category: 'Vegetables', quantityToBuy: 250, unit: 'g', demand: 250, inStock: 0, purchased: false, estimatedCost: 30 },
      { id: 'groc-2', name: 'Paneer', category: 'Dairy', quantityToBuy: 200, unit: 'g', demand: 200, inStock: 0, purchased: false, estimatedCost: 90 },
      { id: 'groc-3', name: 'Curd / Yogurt', category: 'Dairy', quantityToBuy: 200, unit: 'ml', demand: 200, inStock: 0, purchased: true, estimatedCost: 25 },
      { id: 'groc-4', name: 'Semolina (Rava)', category: 'Grains & Pulses', quantityToBuy: 150, unit: 'g', demand: 150, inStock: 0, purchased: false, estimatedCost: 20 }
    ];

    return {
      users: [...SEED_USERS],
      recipes: [...SEED_RECIPES],
      inventory: [...SEED_INVENTORY],
      mealPlans: sampleMealPlans,
      mealHistory: [
        {
          id: 'hist-1',
          date: '2026-10-02',
          mealType: 'Breakfast',
          recipeName: 'Vegetable Poha with Roasted Peanuts',
          status: 'Completed',
          rating: 5,
          prepTime: '15 min',
          reason: '-'
        },
        {
          id: 'hist-2',
          date: '2026-10-02',
          mealType: 'Dinner',
          recipeName: 'Moong Dal Khichdi with Curd',
          status: 'Completed',
          rating: 5,
          prepTime: '20 min',
          reason: '-'
        }
      ],
      grocery: sampleGrocery,
      feedback: [...SEED_FEEDBACK],
      notifications: [...SEED_NOTIFICATIONS],
      categories: [...SEED_CATEGORIES]
    };
  }

  loadStore() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // If file exists but is empty or missing entities, seed it
        if (!parsed.recipes || parsed.recipes.length === 0) {
          console.log('🔄 Initializing RecipeMate database with default rich Indian recipe catalog...');
          const seeded = this.getInitialSeed();
          this.saveStoreDirect(seeded);
          return seeded;
        }
        return parsed;
      }
    } catch (err) {
      console.error('⚠️ Warning reading store.json, re-initializing:', err.message);
    }

    const seeded = this.getInitialSeed();
    this.saveStoreDirect(seeded);
    return seeded;
  }

  saveStore() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed saving to store.json:', err.message);
    }
  }

  saveStoreDirect(data) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed saving to store.json direct:', err.message);
    }
  }

  resetToSeed() {
    this.store = this.getInitialSeed();
    this.saveStore();
    return this.store;
  }

  // --- Collection Accessors & CRUD ---
  getUsers() { return this.store.users || []; }
  saveUsers(users) { this.store.users = users; this.saveStore(); }

  getRecipes() { return this.store.recipes || []; }
  saveRecipes(recipes) { this.store.recipes = recipes; this.saveStore(); }

  getInventory() { return this.store.inventory || []; }
  saveInventory(inventory) { this.store.inventory = inventory; this.saveStore(); }

  getMealPlans() { return this.store.mealPlans || []; }
  saveMealPlans(plans) { this.store.mealPlans = plans; this.saveStore(); }

  getMealHistory() { return this.store.mealHistory || []; }
  saveMealHistory(hist) { this.store.mealHistory = hist; this.saveStore(); }

  getGrocery() { return this.store.grocery || []; }
  saveGrocery(grocery) { this.store.grocery = grocery; this.saveStore(); }

  getFeedback() { return this.store.feedback || []; }
  saveFeedback(fb) { this.store.feedback = fb; this.saveStore(); }

  getNotifications() { return this.store.notifications || []; }
  saveNotifications(notifs) { this.store.notifications = notifs; this.saveStore(); }

  getCategories() { return this.store.categories || []; }
  saveCategories(cats) { this.store.categories = cats; this.saveStore(); }
}

export const dataStore = new DataStore();
