/**
 * RecipeMate - Seed Data for Academic Project Demonstration
 * Realistic, curated Indian home-style recipes, pantry inventory,
 * default users, categories, and initial notification schedules.
 */

export const SEED_USERS = [
  {
    id: 'usr-1',
    name: 'Priya Sharma',
    email: 'demo@recipemate.com',
    username: 'priya_cooks',
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
    username: 'admin',
    password: 'Admin@123',
    role: 'ADMIN',
    avatar: '🛡️',
    ageGroup: '36-50',
    foodPreference: 'All Cuisines',
    dietaryPreference: 'All Diets',
    primaryGoal: 'Waste Reduction',
    status: 'Active',
    joinedDate: '2023-11-01'
  },
  {
    id: 'usr-3',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    username: 'rahul_v',
    password: 'User@123',
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
    email: 'kavita@example.com',
    username: 'kavita_n',
    password: 'User@123',
    role: 'USER',
    avatar: '👩‍💻',
    ageGroup: '36-50',
    foodPreference: 'South Indian',
    dietaryPreference: 'Vegetarian',
    primaryGoal: 'Healthy Eating',
    status: 'Active',
    joinedDate: '2024-03-01'
  }
];

export const SEED_RECIPES = [
  {
    id: 'rec-1',
    name: 'Egg Tomato Curry with Phulkas',
    category: 'Lunch',
    regionalCategory: 'South Indian',
    mealCategory: 'Lunch',
    dietCategory: 'Egg',
    dietType: 'Non-Vegetarian',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 2,
    calories: 280,
    protein: '14g',
    imageEmoji: '🍳',
    rating: 4.8,
    reviewsCount: 34,
    goalTags: ['Quick & Easy', 'Fitness', 'Family Meals', 'Healthy Eating'],
    ingredients: [
      { name: 'Egg', amount: 3, unit: 'pcs' },
      { name: 'Tomato', amount: 2, unit: 'pcs' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Green Chilli', amount: 2, unit: 'pcs' },
      { name: 'Ginger Garlic Paste', amount: 1, unit: 'tsp' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 2, unit: 'tbsp' }
    ],
    steps: [
      'Boil eggs for 9 minutes, peel and make gentle vertical slits.',
      'Heat oil in a pan, sauté chopped onions and slit green chillies until translucent.',
      'Add ginger-garlic paste, turmeric, and chopped tomatoes. Cook till mushy and oil separates.',
      'Pour 1/2 cup warm water, slide in boiled eggs, and simmer for 5 minutes.',
      'Garnish with fresh coriander leaves and serve warm with rotis.'
    ]
  },
  {
    id: 'rec-2',
    name: 'Classic Toor Dal Sambar with Steamed Rice',
    category: 'Lunch',
    regionalCategory: 'South Indian',
    mealCategory: 'Lunch',
    dietCategory: 'Vegetarian',
    dietType: 'Vegetarian',
    cookingTime: 30,
    difficulty: 'Medium',
    servings: 4,
    calories: 340,
    protein: '11g',
    imageEmoji: '🍲',
    rating: 4.9,
    reviewsCount: 88,
    goalTags: ['Family Meals', 'Healthy Eating', 'Regular Home Food'],
    ingredients: [
      { name: 'Toor Dal', amount: 150, unit: 'g' },
      { name: 'Rice', amount: 300, unit: 'g' },
      { name: 'Tomato', amount: 2, unit: 'pcs' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Mustard Seeds', amount: 1, unit: 'tsp' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1, unit: 'tbsp' }
    ],
    steps: [
      'Pressure cook toor dal with a pinch of turmeric powder until soft and mashable.',
      'In a pot, boil sliced onions and tomatoes with sambar powder and salt until tender.',
      'Pour cooked dal into the vegetable broth and bring to a gentle boil.',
      'In a small tadka pan, temper mustard seeds, curry leaves, and a pinch of asafoetida in oil.',
      'Pour hot tempering over sambar and serve over steaming hot rice.'
    ]
  },
  {
    id: 'rec-3',
    name: 'Vegetable Poha with Roasted Peanuts',
    category: 'Breakfast',
    regionalCategory: 'North Indian',
    mealCategory: 'Breakfast',
    dietCategory: 'Healthy/Diet',
    dietType: 'Vegetarian',
    cookingTime: 15,
    difficulty: 'Easy',
    servings: 2,
    calories: 220,
    protein: '6g',
    imageEmoji: '🥣',
    rating: 4.7,
    reviewsCount: 42,
    goalTags: ['Quick & Easy', 'Weight Management', 'Healthy Eating'],
    ingredients: [
      { name: 'Poha (Flattened Rice)', amount: 150, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Green Chilli', amount: 2, unit: 'pcs' },
      { name: 'Mustard Seeds', amount: 1, unit: 'tsp' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1, unit: 'tbsp' },
      { name: 'Lemon', amount: 0.5, unit: 'pcs' }
    ],
    steps: [
      'Rinse poha in a colander under running water for 30 seconds and drain thoroughly.',
      'Heat oil in a pan, crackle mustard seeds and roast peanuts until crunchy.',
      'Add chopped onions, green chillies, and turmeric. Sauté for 3 minutes.',
      'Add softened poha, salt, and gently toss on low flame for 3 minutes.',
      'Squeeze fresh lemon juice, toss once more, and serve warm.'
    ]
  },
  {
    id: 'rec-4',
    name: 'Moong Dal Khichdi with Curd',
    category: 'Dinner',
    regionalCategory: 'North Indian',
    mealCategory: 'Dinner',
    dietCategory: 'Healthy/Diet',
    dietType: 'Vegetarian',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 2,
    calories: 260,
    protein: '10g',
    imageEmoji: '🍚',
    rating: 4.8,
    reviewsCount: 65,
    goalTags: ['Healthy Eating', 'Senior-Friendly', 'Quick & Easy', 'Weight Management'],
    ingredients: [
      { name: 'Moong Dal', amount: 100, unit: 'g' },
      { name: 'Rice', amount: 100, unit: 'g' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cumin Seeds', amount: 1, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1, unit: 'tbsp' },
      { name: 'Curd / Yogurt', amount: 100, unit: 'ml' }
    ],
    steps: [
      'Wash moong dal and rice together in water twice.',
      'In a pressure cooker, heat oil or ghee, add cumin seeds, and let them sizzle.',
      'Add turmeric, dal, rice, and 4 cups of water with salt.',
      'Close cooker and cook for 3 whistles until soft and porridge-like.',
      'Serve hot with a spoonful of fresh curd and a dash of roasted cumin.'
    ]
  },
  {
    id: 'rec-5',
    name: 'Palak Paneer with Soft Rotis',
    category: 'Dinner',
    regionalCategory: 'North Indian',
    mealCategory: 'Dinner',
    dietCategory: 'Vegetarian',
    dietType: 'Vegetarian',
    cookingTime: 25,
    difficulty: 'Medium',
    servings: 3,
    calories: 320,
    protein: '16g',
    imageEmoji: '🥬',
    rating: 4.9,
    reviewsCount: 52,
    goalTags: ['Fitness', 'Healthy Eating', 'Family Meals'],
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', amount: 200, unit: 'g' },
      { name: 'Spinach (Palak)', amount: 250, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Tomato', amount: 1, unit: 'pcs' },
      { name: 'Ginger Garlic Paste', amount: 1, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1.5, unit: 'tbsp' }
    ],
    steps: [
      'Blanch washed spinach leaves in boiling water for 2 minutes, then transfer to cold water.',
      'Blend blanched spinach with 1 green chilli into a vibrant smooth puree.',
      'In a kadai, sauté chopped onions, ginger garlic paste, and pureed tomatoes.',
      'Add spinach puree, salt, and garam masala. Simmer on low heat for 5 minutes.',
      'Add paneer cubes and let them absorb flavors for 3 minutes before serving.'
    ]
  },
  {
    id: 'rec-6',
    name: 'Steamed Soft Idli with Coconut Chutney',
    category: 'Breakfast',
    regionalCategory: 'South Indian',
    mealCategory: 'Breakfast',
    dietCategory: 'Healthy/Diet',
    dietType: 'Vegetarian',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 3,
    calories: 180,
    protein: '6g',
    imageEmoji: '⚪',
    rating: 4.9,
    reviewsCount: 95,
    goalTags: ['Healthy Eating', 'Weight Management', 'Senior-Friendly'],
    ingredients: [
      { name: 'Idli Batter', amount: 400, unit: 'ml' },
      { name: 'Coconut', amount: 100, unit: 'g' },
      { name: 'Green Chilli', amount: 2, unit: 'pcs' },
      { name: 'Mustard Seeds', amount: 1, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1, unit: 'tsp' }
    ],
    steps: [
      'Grease idli plates lightly with cooking oil.',
      'Pour spoonfuls of fermented idli batter into each mould.',
      'Steam in an idli pot or steamer on medium flame for 10-12 minutes.',
      'Blend fresh coconut, green chilli, and roasted gram with salt and water for chutney.',
      'Demould soft idlis using a wet spoon and serve warm with chutney.'
    ]
  },
  {
    id: 'rec-7',
    name: 'Masala Omelette with Brown Bread',
    category: 'Breakfast',
    regionalCategory: 'South Indian',
    mealCategory: 'Breakfast',
    dietCategory: 'Egg',
    dietType: 'Non-Vegetarian',
    cookingTime: 10,
    difficulty: 'Easy',
    servings: 1,
    calories: 240,
    protein: '13g',
    imageEmoji: '🥪',
    rating: 4.6,
    reviewsCount: 29,
    goalTags: ['Quick & Easy', 'Fitness', 'Healthy Eating'],
    ingredients: [
      { name: 'Egg', amount: 2, unit: 'pcs' },
      { name: 'Onion', amount: 0.5, unit: 'pcs' },
      { name: 'Tomato', amount: 0.5, unit: 'pcs' },
      { name: 'Green Chilli', amount: 1, unit: 'pcs' },
      { name: 'Cooking Oil', amount: 1, unit: 'tsp' }
    ],
    steps: [
      'Crack eggs into a bowl, add finely chopped onions, tomatoes, chillies, salt, and pepper.',
      'Whisk vigorously with a fork until frothy.',
      'Heat oil in a pan, pour egg mixture, and cook on medium heat for 2 minutes.',
      'Flip gently once golden on the underside and cook for another 1 minute.',
      'Serve hot alongside toasted whole wheat bread slices.'
    ]
  },
  {
    id: 'rec-8',
    name: 'Homestyle Chicken Curry with Rice',
    category: 'Lunch',
    regionalCategory: 'South Indian',
    mealCategory: 'Lunch',
    dietCategory: 'Non-Vegetarian',
    dietType: 'Non-Vegetarian',
    cookingTime: 35,
    difficulty: 'Medium',
    servings: 3,
    calories: 420,
    protein: '28g',
    imageEmoji: '🍗',
    rating: 4.9,
    reviewsCount: 76,
    goalTags: ['Fitness', 'Family Meals'],
    ingredients: [
      { name: 'Chicken', amount: 350, unit: 'g' },
      { name: 'Onion', amount: 2, unit: 'pcs' },
      { name: 'Tomato', amount: 2, unit: 'pcs' },
      { name: 'Ginger Garlic Paste', amount: 1, unit: 'tbsp' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 2, unit: 'tbsp' }
    ],
    steps: [
      'Marinate clean chicken pieces with turmeric, salt, and 1 tsp ginger garlic paste.',
      'Heat oil in a heavy-bottom pan, brown sliced onions until deep golden.',
      'Add ginger garlic paste, chopped tomatoes, and cook till oil separates.',
      'Add marinated chicken and sauté on high flame for 5 minutes to sear in juices.',
      'Add 1 cup water, cover, and simmer for 20 minutes until tender. Serve with rice.'
    ]
  },
  {
    id: 'rec-9',
    name: 'Yellow Dal Tadka with Steamed Rice',
    category: 'Dinner',
    regionalCategory: 'North Indian',
    mealCategory: 'Dinner',
    dietCategory: 'Vegetarian',
    dietType: 'Vegetarian',
    cookingTime: 25,
    difficulty: 'Easy',
    servings: 3,
    calories: 310,
    protein: '12g',
    imageEmoji: '🥘',
    rating: 4.8,
    reviewsCount: 61,
    goalTags: ['Healthy Eating', 'Family Meals', 'Quick & Easy'],
    ingredients: [
      { name: 'Toor Dal', amount: 150, unit: 'g' },
      { name: 'Rice', amount: 200, unit: 'g' },
      { name: 'Tomato', amount: 1, unit: 'pcs' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Garlic', amount: 4, unit: 'cloves' },
      { name: 'Mustard Seeds', amount: 1, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1.5, unit: 'tbsp' }
    ],
    steps: [
      'Boil toor dal with turmeric and salt until smooth and creamy.',
      'In a pan, heat oil and sauté chopped onions, minced garlic, and tomatoes.',
      'Pour cooked dal into the pan and adjust water to desired soup-like consistency.',
      'Prepare a sizzling tadka with mustard seeds, dried red chilli, and hing.',
      'Pour the aromatic tempering over the dal and serve immediately with hot rice.'
    ]
  },
  {
    id: 'rec-10',
    name: 'Aloo Gobi Dry with Phulkas',
    category: 'Dinner',
    regionalCategory: 'North Indian',
    mealCategory: 'Dinner',
    dietCategory: 'Vegetarian',
    dietType: 'Vegetarian',
    cookingTime: 25,
    difficulty: 'Easy',
    servings: 2,
    calories: 240,
    protein: '5g',
    imageEmoji: '🥔',
    rating: 4.6,
    reviewsCount: 38,
    goalTags: ['Family Meals', 'Quick & Easy', 'Regular Home Food'],
    ingredients: [
      { name: 'Potato', amount: 2, unit: 'pcs' },
      { name: 'Cauliflower (Gobi)', amount: 200, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Turmeric Powder', amount: 0.5, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1.5, unit: 'tbsp' }
    ],
    steps: [
      'Chop potatoes into cubes and cauliflower into bite-sized florets.',
      'Heat oil in a pan, crackle cumin seeds, and add chopped onions and potatoes.',
      'Cook covered for 6 minutes until potatoes begin to soften.',
      'Add cauliflower, turmeric, coriander powder, salt, and stir well.',
      'Cover and steam on low flame for 10 minutes until tender with crispy edges.'
    ]
  },
  {
    id: 'rec-11',
    name: 'Rava Vegetable Upma',
    category: 'Breakfast',
    regionalCategory: 'South Indian',
    mealCategory: 'Breakfast',
    dietCategory: 'Healthy/Diet',
    dietType: 'Vegetarian',
    cookingTime: 15,
    difficulty: 'Easy',
    servings: 2,
    calories: 210,
    protein: '5g',
    imageEmoji: '🍲',
    rating: 4.5,
    reviewsCount: 30,
    goalTags: ['Quick & Easy', 'Healthy Eating'],
    ingredients: [
      { name: 'Semolina (Rava)', amount: 150, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Green Chilli', amount: 2, unit: 'pcs' },
      { name: 'Mustard Seeds', amount: 1, unit: 'tsp' },
      { name: 'Cooking Oil', amount: 1, unit: 'tbsp' }
    ],
    steps: [
      'Dry roast rava in a pan on medium heat for 4 minutes until fragrant.',
      'Heat oil in a pan, temper mustard seeds, curry leaves, and green chillies.',
      'Add sliced onions and cook until soft.',
      'Add 2.5 cups of water with salt and bring to a rolling boil.',
      'Slowly stream in roasted rava while stirring continuously to prevent lumps. Cover for 3 min.'
    ]
  },
  {
    id: 'rec-12',
    name: 'Spiced Roasted Makhana',
    category: 'Snacks',
    regionalCategory: 'North Indian',
    mealCategory: 'Snacks',
    dietCategory: 'Healthy/Diet',
    dietType: 'Vegetarian',
    cookingTime: 10,
    difficulty: 'Easy',
    servings: 2,
    calories: 140,
    protein: '4g',
    imageEmoji: '🍿',
    rating: 4.8,
    reviewsCount: 22,
    goalTags: ['Quick & Easy', 'Weight Management', 'Healthy Eating'],
    ingredients: [
      { name: 'Foxnuts (Makhana)', amount: 60, unit: 'g' },
      { name: 'Cooking Oil', amount: 1, unit: 'tsp' },
      { name: 'Turmeric Powder', amount: 0.25, unit: 'tsp' }
    ],
    steps: [
      'Heat oil or ghee in a heavy pan on low flame.',
      'Add makhana and roast slowly for 6-8 minutes until crisp and easily crushable.',
      'Sprinkle turmeric, chaat masala, and rock salt.',
      'Toss well for 1 minute so the spices adhere to the roasted foxnuts.',
      'Let cool for 5 minutes and enjoy as a nutritious guilt-free tea-time snack.'
    ]
  }
];

export const SEED_INVENTORY = [
  { id: 'inv-1', name: 'Onion', category: 'Vegetables', quantity: 2, unit: 'kg', storageLocation: 'Pantry Shelf', expiryDate: '2026-10-20', purchaseDate: '2026-10-01' },
  { id: 'inv-2', name: 'Tomato', category: 'Vegetables', quantity: 1.5, unit: 'kg', storageLocation: 'Fridge Crisp Tray', expiryDate: '2026-10-09', purchaseDate: '2026-10-02' },
  { id: 'inv-3', name: 'Green Chilli', category: 'Vegetables', quantity: 100, unit: 'g', storageLocation: 'Fridge Door', expiryDate: '2026-10-12', purchaseDate: '2026-10-02' },
  { id: 'inv-4', name: 'Egg', category: 'Protein', quantity: 6, unit: 'pcs', storageLocation: 'Fridge Top Shelf', expiryDate: '2026-10-14', purchaseDate: '2026-10-02' },
  { id: 'inv-5', name: 'Toor Dal', category: 'Grains & Pulses', quantity: 1, unit: 'kg', storageLocation: 'Pantry Airtight Bin', expiryDate: '2027-04-10', purchaseDate: '2026-09-15' },
  { id: 'inv-6', name: 'Rice', category: 'Grains & Pulses', quantity: 3, unit: 'kg', storageLocation: 'Kitchen Storage Bin', expiryDate: '2027-06-01', purchaseDate: '2026-09-15' },
  { id: 'inv-7', name: 'Mustard Seeds', category: 'Spices & Staples', quantity: 200, unit: 'g', storageLocation: 'Masala Dabba', expiryDate: '2027-08-01', purchaseDate: '2026-08-01' },
  { id: 'inv-8', name: 'Turmeric Powder', category: 'Spices & Staples', quantity: 150, unit: 'g', storageLocation: 'Spice Rack', expiryDate: '2027-09-01', purchaseDate: '2026-08-01' },
  { id: 'inv-9', name: 'Cooking Oil', category: 'Spices & Staples', quantity: 1, unit: 'L', storageLocation: 'Pantry Oil Rack', expiryDate: '2027-03-01', purchaseDate: '2026-09-20' },
  { id: 'inv-10', name: 'Fresh Coriander', category: 'Vegetables', quantity: 1, unit: 'pcs', storageLocation: 'Fridge Chiller', expiryDate: '2026-10-05', purchaseDate: '2026-10-02' }
];

export const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'South Indian', icon: '🥞', description: 'Idli, Dosa, Sambar, Rasam & Rice staples', recipeCount: 5 },
  { id: 'cat-2', name: 'North Indian', icon: '🫓', description: 'Phulkas, Dal Tadka, Khichdi, Poha & Curries', recipeCount: 5 },
  { id: 'cat-3', name: 'Breakfast', icon: '🌅', description: 'Energizing morning meals ready in minutes', recipeCount: 4 },
  { id: 'cat-4', name: 'Lunch', icon: '☀️', description: 'Wholesome rice, dal, and protein curries', recipeCount: 4 },
  { id: 'cat-5', name: 'Dinner', icon: '🌙', description: 'Light, comforting, and easily digestible home dishes', recipeCount: 4 },
  { id: 'cat-6', name: 'Snacks', icon: '☕', description: 'Quick, healthy tea-time bites', recipeCount: 1 },
  { id: 'cat-7', name: 'Vegetarian', icon: '🥬', description: '100% plant and dairy based recipes', recipeCount: 9 },
  { id: 'cat-8', name: 'Non-Vegetarian', icon: '🍗', description: 'Chicken and egg based protein dishes', recipeCount: 3 },
  { id: 'cat-9', name: 'Healthy/Diet', icon: '🥗', description: 'Balanced fiber, low oil, and nutrient dense dishes', recipeCount: 6 }
];

export const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'meal',
    title: 'Upcoming Lunch Reminder',
    message: 'Time to prepare "Classic Toor Dal Sambar with Steamed Rice" scheduled for 01:00 PM.',
    time: '30 mins ago',
    unread: true,
    actionUrl: 'planner'
  },
  {
    id: 'notif-2',
    type: 'expiry',
    title: 'Ingredient Expiry Warning',
    message: 'Fresh Coriander in your fridge expires in 1 day! Consider using it for garnishing today.',
    time: '2 hours ago',
    unread: true,
    actionUrl: 'inventory'
  },
  {
    id: 'notif-3',
    type: 'grocery',
    title: 'Grocery Deficit Alert',
    message: 'You have 3 missing ingredients for tomorrow’s meals. Check your generated Grocery List.',
    time: '1 day ago',
    unread: false,
    actionUrl: 'grocery'
  },
  {
    id: 'notif-4',
    type: 'reschedule',
    title: 'Meal Rescheduled Confirmation',
    message: 'Egg Tomato Curry was rescheduled from Tuesday Dinner to Wednesday Lunch.',
    time: '2 days ago',
    unread: false,
    actionUrl: 'history'
  }
];

export const SEED_FEEDBACK = [
  {
    id: 'fb-1',
    userName: 'Priya Sharma',
    recipeName: 'Classic Toor Dal Sambar with Steamed Rice',
    rating: 5,
    type: 'Recipe Feedback',
    comment: 'The tamarind and dal balance was absolute perfection! Family loved it.',
    date: '2026-10-02'
  },
  {
    id: 'fb-2',
    userName: 'Rahul Verma',
    recipeName: 'Vegetable Poha with Roasted Peanuts',
    rating: 5,
    type: 'Recipe Feedback',
    comment: 'Cooked in exactly 12 minutes before college. Super convenient and tasty.',
    date: '2026-10-03'
  }
];
