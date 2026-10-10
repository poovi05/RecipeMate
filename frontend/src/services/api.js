/**
 * RecipeMate Unified REST API Service Layer
 * Connects directly to Node/Express backend at http://localhost:5000/api
 * with clean local fallback to localStorage if backend is offline.
 */

const BASE_URL = '/api';

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch (err) {
    // Backend offline
  }
  return { online: false };
};

export const apiService = {
  async request(endpoint, options = {}) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.warn(`API call ${endpoint} error:`, error.message);
      throw error;
    }
  },

  // Auth
  register: (userData) => apiService.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => apiService.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  updateProfile: (id, updates) => apiService.request(`/auth/profile/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Recipes
  getRecipes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/recipes?${query}` : '/recipes';
    return apiService.request(endpoint).catch(() => null);
  },
  createRecipe: (recipe) => apiService.request('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipe)
  }),
  updateRecipe: (id, recipe) => apiService.request(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipe)
  }),
  deleteRecipe: (id) => apiService.request(`/recipes/${id}`, {
    method: 'DELETE'
  }),

  // AI Recommendation Engine
  getAiRecommendations: (criteria) => apiService.request('/ai/recommend', {
    method: 'POST',
    body: JSON.stringify(criteria)
  }).catch(() => null),

  getAiAlternative: (criteria) => apiService.request('/ai/alternative', {
    method: 'POST',
    body: JSON.stringify(criteria)
  }).catch(() => null),

  // Inventory
  getInventory: () => apiService.request('/inventory').catch(() => null),
  createInventoryItem: (item) => apiService.request('/inventory', {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  updateInventoryItem: (id, item) => apiService.request(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  }),
  deleteInventoryItem: (id) => apiService.request(`/inventory/${id}`, {
    method: 'DELETE'
  }),

  // Meal Plans
  getMealPlan: () => apiService.request('/mealplans').catch(() => null),
  saveMealPlan: (plan) => apiService.request('/mealplans', {
    method: 'POST',
    body: JSON.stringify(plan)
  }),
  generateSmartPlan: (options) => apiService.request('/mealplans/generate', {
    method: 'POST',
    body: JSON.stringify(options)
  }),

  // Meal History
  getMealHistory: () => apiService.request('/feedback/history').catch(() => null),
  logMealHistory: (entry) => apiService.request('/feedback/history', {
    method: 'POST',
    body: JSON.stringify(entry)
  }),

  // Grocery
  getGroceryList: () => apiService.request('/grocery').catch(() => null),
  saveGroceryList: (list) => apiService.request('/grocery', {
    method: 'POST',
    body: JSON.stringify(list)
  }),
  updateGroceryItem: (id, updates) => apiService.request(`/grocery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  deleteGroceryItem: (id) => apiService.request(`/grocery/${id}`, {
    method: 'DELETE'
  }),
  clearCompletedGrocery: () => apiService.request('/grocery/clear-completed', {
    method: 'DELETE'
  }),
  generateGroceryFromPlan: () => apiService.request('/grocery/generate-from-plan', {
    method: 'POST'
  }),

  // Feedback
  getFeedback: () => apiService.request('/feedback').catch(() => null),
  submitFeedback: (feedback) => apiService.request('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedback)
  }),

  // Notifications
  getNotifications: () => apiService.request('/notifications').catch(() => null),
  createNotification: (notif) => apiService.request('/notifications', {
    method: 'POST',
    body: JSON.stringify(notif)
  }),
  markNotificationRead: (id) => apiService.request(`/notifications/${id}/read`, {
    method: 'PUT'
  }),
  clearNotifications: () => apiService.request('/notifications/clear', {
    method: 'DELETE'
  }),

  // Admin
  getAdminMetrics: () => apiService.request('/admin/metrics').catch(() => null),
  getUsers: () => apiService.request('/admin/users').catch(() => null),
  toggleUserStatus: (id) => apiService.request(`/admin/users/${id}/status`, {
    method: 'PUT'
  }),
  deleteUser: (id) => apiService.request(`/admin/users/${id}`, {
    method: 'DELETE'
  }),
  resetDemoData: () => apiService.request('/admin/reset-demo', {
    method: 'POST'
  }),

  // Categories
  getCategories: () => apiService.request('/admin/categories').catch(() => null),
  createCategory: (cat) => apiService.request('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(cat)
  }),
  updateCategory: (id, updates) => apiService.request(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  deleteCategory: (id) => apiService.request(`/admin/categories/${id}`, {
    method: 'DELETE'
  })
};
