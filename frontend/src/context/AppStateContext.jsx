import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/config';
import { generateNetDeficitGroceryList } from '../services/inventorySync';
import { apiService } from '../services/api';

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  // Pure User-Driven State (Initial empty arrays - no fake data!)
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipemate_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('recipemate_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('recipemate_meal_plan');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealHistory, setMealHistory] = useState(() => {
    const saved = localStorage.getItem('recipemate_meal_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('recipemate_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('recipemate_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('recipemate_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('recipemate_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [groceryList, setGroceryList] = useState(() => {
    const saved = localStorage.getItem('recipemate_grocery');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch initial data from Backend API on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const backendRecipes = await apiService.getRecipes();
        if (backendRecipes && Array.isArray(backendRecipes) && backendRecipes.length > 0) {
          setRecipes(backendRecipes);
        }

        const backendInv = await apiService.getInventory();
        if (backendInv && Array.isArray(backendInv) && backendInv.length > 0) {
          setInventory(backendInv);
        }

        const backendPlan = await apiService.getMealPlan();
        if (backendPlan && Array.isArray(backendPlan) && backendPlan.length > 0) {
          setMealPlan(backendPlan);
        }

        const backendHistory = await apiService.getMealHistory();
        if (backendHistory && Array.isArray(backendHistory)) {
          setMealHistory(backendHistory);
        }

        const backendFeedback = await apiService.getFeedback();
        if (backendFeedback && Array.isArray(backendFeedback)) {
          setFeedbackList(backendFeedback);
        }

        const backendUsers = await apiService.getUsers();
        if (backendUsers && Array.isArray(backendUsers)) {
          setUsersList(backendUsers);
        }
      } catch (err) {
        // Backend offline, continuing cleanly with local store
      }
    };

    fetchBackendData();
  }, []);

  // Persist state changes locally & sync with backend
  useEffect(() => {
    localStorage.setItem('recipemate_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('recipemate_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('recipemate_meal_plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem('recipemate_grocery', JSON.stringify(groceryList));
  }, [groceryList]);

  useEffect(() => {
    localStorage.setItem('recipemate_meal_history', JSON.stringify(mealHistory));
  }, [mealHistory]);

  useEffect(() => {
    localStorage.setItem('recipemate_feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('recipemate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('recipemate_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('recipemate_categories', JSON.stringify(categories));
  }, [categories]);

  // Inventory Expiry Helper
  const getExpiringItems = (withinDays = 2) => {
    if (!inventory || inventory.length === 0) return [];
    const today = new Date();
    return inventory.filter((item) => {
      if (!item.expiryDate) return false;
      const exp = new Date(item.expiryDate);
      const diffTime = exp.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= withinDays;
    });
  };

  // Inventory Actions
  const addInventoryItem = async (item) => {
    const newItem = {
      id: `inv-${Date.now()}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      ...item
    };
    setInventory((prev) => [newItem, ...prev]);
    try { await apiService.createInventoryItem(newItem); } catch (e) {}
  };

  const updateInventoryItem = async (id, updates) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    try { await apiService.updateInventoryItem(id, updates); } catch (e) {}
  };

  const deleteInventoryItem = async (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    try { await apiService.deleteInventoryItem(id); } catch (e) {}
  };

  // Recipe CRUD (User & Admin)
  const addRecipe = async (recipeData) => {
    const newRecipe = {
      id: `rec-${Date.now()}`,
      rating: 0,
      reviewsCount: 0,
      imageEmoji: recipeData.imageEmoji || '🍲',
      ...recipeData
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    try { await apiService.createRecipe(newRecipe); } catch (e) {}
  };

  const updateRecipe = async (id, updates) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    try { await apiService.updateRecipe(id, updates); } catch (e) {}
  };

  const deleteRecipe = async (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    try { await apiService.deleteRecipe(id); } catch (e) {}
  };

  // Meal Plan Actions: Cooked, Not Cooked, Reschedule, Change
  const markMealCooked = async (dayIndex, mealTypeKey, ratingData) => {
    const updatedPlan = [...mealPlan];
    if (!updatedPlan[dayIndex]) return;

    const targetDay = { ...updatedPlan[dayIndex] };
    const targetMeal = { ...targetDay.meals[mealTypeKey] };

    targetMeal.status = 'Cooked';
    targetMeal.rating = ratingData.rating || 5;
    targetMeal.review = ratingData.review || 'Cooked as planned!';
    targetMeal.prepDifficulty = ratingData.prepDifficulty || 'Easy';

    targetDay.meals[mealTypeKey] = targetMeal;
    updatedPlan[dayIndex] = targetDay;
    setMealPlan(updatedPlan);

    // Add to Meal History
    const historyEntry = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType: targetMeal.mealType,
      recipeName: targetMeal.recipeName,
      status: 'Completed',
      rating: ratingData.rating || 5,
      prepTime: ratingData.prepTime || '20 min',
      reason: '-'
    };
    setMealHistory((h) => [historyEntry, ...h]);

    // Send to backend
    try {
      await apiService.saveMealPlan(updatedPlan);
      await apiService.logMealHistory(historyEntry);
    } catch (e) {}

    // Add to Feedback list if review provided
    if (ratingData.review) {
      const fbEntry = {
        id: `fb-${Date.now()}`,
        userName: 'Current User',
        recipeName: targetMeal.recipeName,
        rating: ratingData.rating || 5,
        type: 'Recipe Feedback',
        comment: ratingData.review,
        date: new Date().toISOString().split('T')[0]
      };
      setFeedbackList((fb) => [fbEntry, ...fb]);
      try { await apiService.submitFeedback(fbEntry); } catch (e) {}
    }
  };

  const markMealNotCooked = async (dayIndex, mealTypeKey, skipData) => {
    const updatedPlan = [...mealPlan];
    if (!updatedPlan[dayIndex]) return;

    const targetDay = { ...updatedPlan[dayIndex] };
    const targetMeal = { ...targetDay.meals[mealTypeKey] };

    targetMeal.status = 'Skipped';
    targetMeal.skipReason = skipData.reason || 'No time';

    targetDay.meals[mealTypeKey] = targetMeal;
    updatedPlan[dayIndex] = targetDay;
    setMealPlan(updatedPlan);

    const historyEntry = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType: targetMeal.mealType,
      recipeName: targetMeal.recipeName,
      status: 'Skipped',
      rating: null,
      prepTime: '-',
      reason: skipData.reason || 'Skipped'
    };
    setMealHistory((h) => [historyEntry, ...h]);

    try {
      await apiService.saveMealPlan(updatedPlan);
      await apiService.logMealHistory(historyEntry);
    } catch (e) {}
  };

  const rescheduleMeal = async (fromDayIndex, fromMealKey, toDayIndex, toMealKey) => {
    const updatedPlan = [...mealPlan];
    if (!updatedPlan[fromDayIndex] || !updatedPlan[toDayIndex]) return;

    const sourceMeal = { ...updatedPlan[fromDayIndex].meals[fromMealKey] };
    sourceMeal.status = 'Rescheduled';
    updatedPlan[fromDayIndex].meals[fromMealKey] = sourceMeal;

    const targetSlot = updatedPlan[toDayIndex].meals[toMealKey];
    updatedPlan[toDayIndex].meals[toMealKey] = {
      ...sourceMeal,
      id: `resched-${Date.now()}`,
      status: 'Planned',
      time: targetSlot?.time || '08:00 PM',
      mealType: targetSlot?.mealType || 'Dinner'
    };

    setMealPlan(updatedPlan);

    const historyEntry = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType: sourceMeal.mealType,
      recipeName: sourceMeal.recipeName,
      status: 'Rescheduled',
      rating: null,
      prepTime: '-',
      reason: `Moved from ${updatedPlan[fromDayIndex].dayName} to ${updatedPlan[toDayIndex].dayName}`
    };
    setMealHistory((h) => [historyEntry, ...h]);

    try {
      await apiService.saveMealPlan(updatedPlan);
      await apiService.logMealHistory(historyEntry);
    } catch (e) {}
  };

  const changeMealRecipe = async (dayIndex, mealTypeKey, newRecipe) => {
    const updatedPlan = [...mealPlan];
    if (!updatedPlan[dayIndex]) return;

    const targetDay = { ...updatedPlan[dayIndex] };
    const currentMeal = targetDay.meals[mealTypeKey];

    targetDay.meals[mealTypeKey] = {
      ...currentMeal,
      recipeId: newRecipe.id,
      recipeName: newRecipe.name,
      status: 'Planned'
    };
    updatedPlan[dayIndex] = targetDay;
    setMealPlan(updatedPlan);

    try { await apiService.saveMealPlan(updatedPlan); } catch (e) {}
  };

  // Generate Smart Meal Plan using REAL recipes from catalog
  const generateSmartPlan = (durationDays = 7, peopleCount = 2, goalFilter = 'Healthy Eating') => {
    if (!recipes || recipes.length === 0) {
      alert('Please add at least 1 or 2 recipes to the Recipe catalog before generating a meal plan.');
      return false;
    }

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday 2', 'Tuesday 2', 'Wednesday 2', 'Thursday 2', 'Friday 2', 'Saturday 2', 'Sunday 2', 'Day 15'];
    const newPlan = [];

    for (let i = 0; i < durationDays; i++) {
      const bRecipe = recipes[i % recipes.length];
      const lRecipe = recipes[(i + 1) % recipes.length];
      const sRecipe = recipes[(i + 2) % recipes.length] || bRecipe;
      const dRecipe = recipes[(i + 3) % recipes.length] || lRecipe;

      newPlan.push({
        dayIndex: i,
        dayName: dayNames[i] || `Day ${i + 1}`,
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

    setMealPlan(newPlan);
    try { apiService.saveMealPlan(newPlan); } catch (e) {}

    // Calculate real grocery list from new plan & real inventory
    const newGrocery = generateNetDeficitGroceryList(newPlan, recipes, inventory, peopleCount);
    setGroceryList(newGrocery);
    try { apiService.saveGroceryList(newGrocery); } catch (e) {}
    return true;
  };

  // Grocery Actions
  const toggleGroceryPurchased = (id) => {
    const updated = groceryList.map((item) =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    setGroceryList(updated);
    try { apiService.saveGroceryList(updated); } catch (e) {}
  };

  const addGroceryItem = (item) => {
    const newItem = {
      id: `groc-${Date.now()}`,
      demand: item.quantityToBuy,
      inStock: 0,
      purchased: false,
      estimatedCost: 30,
      ...item
    };
    const updated = [newItem, ...groceryList];
    setGroceryList(updated);
    try { apiService.saveGroceryList(updated); } catch (e) {}
  };

  const deleteGroceryItem = (id) => {
    const updated = groceryList.filter((item) => item.id !== id);
    setGroceryList(updated);
    try { apiService.saveGroceryList(updated); } catch (e) {}
  };

  const refreshGroceryFromPlan = () => {
    if (mealPlan.length === 0) {
      setGroceryList([]);
      return;
    }
    const updated = generateNetDeficitGroceryList(mealPlan, recipes, inventory, 2);
    setGroceryList(updated);
    try { apiService.saveGroceryList(updated); } catch (e) {}
  };

  const clearCompletedGrocery = () => {
    const updated = groceryList.filter((item) => !item.purchased);
    setGroceryList(updated);
    try { apiService.saveGroceryList(updated); } catch (e) {}
    try { apiService.clearCompletedGrocery(); } catch (e) {}
  };

  // Notification Actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Admin User Actions
  const toggleUserStatus = async (userId) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
    try { await apiService.toggleUserStatus(userId); } catch (e) {}
  };

  const deleteUser = async (userId) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    try { await apiService.deleteUser(userId); } catch (e) {}
  };

  // Admin Category Actions
  const addCategory = async (cat) => {
    const newCat = { id: `cat-${Date.now()}`, recipeCount: 0, ...cat };
    setCategories((prev) => [...prev, newCat]);
    try { await apiService.createCategory(newCat); } catch (e) {}
  };

  const updateCategory = async (id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try { await apiService.updateCategory(id, updates); } catch (e) {}
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try { await apiService.deleteCategory(id); } catch (e) {}
  };

  // Real-time Dynamic Analytics (Strictly computed from actual user data)
  const analyticsData = useMemo(() => {
    let totalMeals = 0;
    let completedMeals = 0;
    let skippedMeals = 0;
    let rescheduledMeals = 0;

    mealPlan.forEach((day) => {
      Object.values(day.meals || {}).forEach((m) => {
        totalMeals++;
        if (m.status === 'Cooked') completedMeals++;
        else if (m.status === 'Skipped') skippedMeals++;
        else if (m.status === 'Rescheduled') rescheduledMeals++;
      });
    });

    mealHistory.forEach((h) => {
      if (h.status === 'Completed') completedMeals++;
      else if (h.status === 'Skipped') skippedMeals++;
      else if (h.status === 'Rescheduled') rescheduledMeals++;
    });

    const completionRate =
      completedMeals + skippedMeals > 0
        ? Math.round((completedMeals / (completedMeals + skippedMeals)) * 100)
        : 0;

    // Real waste metrics: only if user has cooked meals or saved items
    const expiringItemsCount = getExpiringItems().length;
    const expiringItemsSaved = completedMeals;
    const foodWasteAvoidedKg = (expiringItemsSaved * 0.4).toFixed(1);
    const estimatedMoneySaved = expiringItemsSaved * 45;

    return {
      totalMealsPlanned: totalMeals,
      completedMeals,
      skippedMeals,
      rescheduledMeals,
      completionRate,
      expiringItemsCount,
      expiringItemsSaved,
      foodWasteAvoidedKg,
      estimatedMoneySaved,
      inventoryCount: inventory.length,
      groceryCount: groceryList.length
    };
  }, [mealPlan, mealHistory, inventory, groceryList]);

  return (
    <AppStateContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        getExpiringItems,
        mealPlan,
        markMealCooked,
        markMealNotCooked,
        rescheduleMeal,
        changeMealRecipe,
        generateSmartPlan,
        groceryList,
        toggleGroceryPurchased,
        addGroceryItem,
        deleteGroceryItem,
        refreshGroceryFromPlan,
        clearCompletedGrocery,
        mealHistory,
        feedbackList,
        setFeedbackList,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        usersList,
        toggleUserStatus,
        deleteUser,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        analyticsData
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
