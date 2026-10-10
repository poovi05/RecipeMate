export const DEMO_USERS = [
  {
    id: 'usr-1',
    name: 'Priya Sharma',
    email: 'demo@recipemate.com',
    password: 'Demo@123',
    role: 'USER',
    avatar: '👩‍🍳',
    ageGroup: '26-35',
    foodPreference: 'South Indian & North Indian Mix',
    dietaryPreference: 'Vegetarian (Eggs Allowed)',
    primaryGoal: 'Healthy Eating',
    status: 'Active',
    joinedDate: '2024-01-15'
  },
  {
    id: 'usr-2',
    name: 'System Administrator',
    email: 'admin@recipemate.com',
    password: 'Admin@123',
    role: 'ADMIN',
    avatar: '🛡️',
    status: 'Active',
    joinedDate: '2023-11-01'
  },
  {
    id: 'usr-3',
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    role: 'USER',
    avatar: '👨‍💼',
    ageGroup: '18-25',
    foodPreference: 'North Indian',
    dietaryPreference: 'Vegetarian',
    primaryGoal: 'Fitness',
    status: 'Active',
    joinedDate: '2024-02-10'
  },
  {
    id: 'usr-4',
    name: 'Kavita Nair',
    email: 'kavita.n@example.com',
    role: 'USER',
    avatar: '👩‍💻',
    ageGroup: '36-50',
    foodPreference: 'South Indian',
    dietaryPreference: 'Vegetarian',
    primaryGoal: 'Senior-Friendly',
    status: 'Active',
    joinedDate: '2024-03-01'
  }
];

export const CATEGORIES_LIST = [
  { id: 'cat-1', name: 'South Indian', icon: '🥞', description: 'Idli, Dosa, Sambar, Rasam & Rice varieties', recipeCount: 8 },
  { id: 'cat-2', name: 'North Indian', icon: '🫓', description: 'Phulkas, Dal Tadka, Rajma, Chole & Pulao', recipeCount: 6 },
  { id: 'cat-3', name: 'Quick & Easy', icon: '⏱️', description: 'Fast meals ready in under 20 minutes', recipeCount: 4 },
  { id: 'cat-4', name: 'Fitness & High Protein', icon: '💪', description: 'Nutrient-dense, high protein recipes', recipeCount: 5 },
  { id: 'cat-5', name: 'Healthy Eating', icon: '🥗', description: 'Balanced fiber and wholesome staples', recipeCount: 7 },
  { id: 'cat-6', name: 'Senior-Friendly', icon: '👴', description: 'Soft, easily digestible comfort food', recipeCount: 4 },
  { id: 'cat-7', name: 'Family Meals', icon: '👨‍👩‍👧', description: 'Generous servings suitable for everyone', recipeCount: 9 }
];

export const GOALS_LIST = [
  { id: 'goal-1', label: 'Healthy Eating', icon: '🥗', desc: 'Balanced nutrition & fresh ingredients' },
  { id: 'goal-2', label: 'Fitness / Gym', icon: '💪', desc: 'High protein & lean strength meals' },
  { id: 'goal-3', label: 'Weight Management', icon: '⚖️', desc: 'Portion controlled, high fiber dishes' },
  { id: 'goal-4', label: 'Quick & Easy', icon: '⏱️', desc: 'Speedy cooking within 15-20 minutes' },
  { id: 'goal-5', label: 'Family Meals', icon: '👨‍👩‍👧', desc: 'Kid & parent approved everyday food' },
  { id: 'goal-6', label: 'Senior-Friendly', icon: '👴', desc: 'Mild spices, soothing digestion' },
  { id: 'goal-7', label: 'Regular Home Food', icon: '🍱', desc: 'Traditional comfort everyday cooking' }
];

export const INITIAL_FEEDBACK_LIST = [
  {
    id: 'fb-1',
    userName: 'Priya Sharma',
    userEmail: 'demo@recipemate.com',
    recipeName: 'Crispy Dosa with Coconut Chutney',
    rating: 5,
    type: 'Recipe Feedback',
    comment: 'The batter ratio and temperature tip made the dosas so crispy!',
    date: '2024-03-18'
  },
  {
    id: 'fb-2',
    userName: 'Rahul Verma',
    userEmail: 'rahul.v@example.com',
    recipeName: 'Sprouted Moong Salad',
    rating: 5,
    type: 'Recipe Feedback',
    comment: 'Great post workout snack. Kept me full without feeling heavy.',
    date: '2024-03-17'
  },
  {
    id: 'fb-3',
    userName: 'Kavita Nair',
    userEmail: 'kavita.n@example.com',
    recipeName: 'AI Meal Planner',
    rating: 4,
    type: 'Meal Planner Feedback',
    comment: 'Saved me at least 3 hours of planning this week and zero veggies spoiled!',
    date: '2024-03-15'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: '⚠️ Expiring Ingredient Alert',
    message: 'Tomatoes (500g) are expiring in 24 hours. Tap to see quick recipes like Tomato Rasam or Egg Tomato Curry.',
    type: 'warning',
    time: '10 mins ago',
    unread: true,
    actionUrl: 'recipes'
  },
  {
    id: 'notif-2',
    title: '🍲 Dinner Preparation Reminder',
    message: 'Time to prepare tonight’s meal: Egg Tomato Curry (20 mins).',
    type: 'info',
    time: '2 hours ago',
    unread: true,
    actionUrl: 'planner'
  },
  {
    id: 'notif-3',
    title: '🛒 Grocery List Generated',
    message: 'Your weekly grocery list is ready! 4 items deducted from existing home inventory.',
    type: 'success',
    time: '1 day ago',
    unread: false,
    actionUrl: 'grocery'
  }
];

export const INITIAL_MEAL_HISTORY = [
  {
    id: 'hist-1',
    date: '2024-03-19',
    mealType: 'Breakfast',
    recipeName: 'Crispy Dosa with Coconut Chutney',
    status: 'Completed',
    rating: 5,
    prepTime: '15 min',
    reason: '-'
  },
  {
    id: 'hist-2',
    date: '2024-03-19',
    mealType: 'Lunch',
    recipeName: 'Classic Sambar with Steamed Rice',
    status: 'Completed',
    rating: 4,
    prepTime: '30 min',
    reason: '-'
  },
  {
    id: 'hist-3',
    date: '2024-03-18',
    mealType: 'Dinner',
    recipeName: 'Vegetable Upma',
    status: 'Skipped',
    rating: null,
    prepTime: '-',
    reason: 'No time / Ordered outside'
  },
  {
    id: 'hist-4',
    date: '2024-03-18',
    mealType: 'Lunch',
    recipeName: 'Homestyle Rajma Masala',
    status: 'Completed',
    rating: 5,
    prepTime: '35 min',
    reason: '-'
  },
  {
    id: 'hist-5',
    date: '2024-03-17',
    mealType: 'Dinner',
    recipeName: 'Palak Paneer',
    status: 'Rescheduled',
    rating: null,
    prepTime: '-',
    reason: 'Ingredients unavailable'
  }
];
