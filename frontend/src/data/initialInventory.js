// Helper to generate dynamic ISO dates relative to today
const getOffsetDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    name: 'Tomato',
    category: 'Vegetables',
    quantity: 500,
    unit: 'g',
    purchaseDate: getOffsetDate(-4),
    expiryDate: getOffsetDate(1), // Expiring in 1 day!
    storageLocation: 'Fridge',
    cost: 25
  },
  {
    id: 'inv-2',
    name: 'Spinach',
    category: 'Vegetables',
    quantity: 250,
    unit: 'g',
    purchaseDate: getOffsetDate(-3),
    expiryDate: getOffsetDate(2), // Expiring in 2 days!
    storageLocation: 'Fridge',
    cost: 30
  },
  {
    id: 'inv-3',
    name: 'Onion',
    category: 'Vegetables',
    quantity: 1.5,
    unit: 'kg',
    purchaseDate: getOffsetDate(-6),
    expiryDate: getOffsetDate(12),
    storageLocation: 'Pantry Basket',
    cost: 60
  },
  {
    id: 'inv-4',
    name: 'Egg',
    category: 'Protein',
    quantity: 6,
    unit: 'pcs',
    purchaseDate: getOffsetDate(-2),
    expiryDate: getOffsetDate(8),
    storageLocation: 'Fridge',
    cost: 42
  },
  {
    id: 'inv-5',
    name: 'Rice',
    category: 'Grains',
    quantity: 2,
    unit: 'kg',
    purchaseDate: getOffsetDate(-10),
    expiryDate: getOffsetDate(90),
    storageLocation: 'Pantry Bin',
    cost: 110
  },
  {
    id: 'inv-6',
    name: 'Toor Dal',
    category: 'Grains',
    quantity: 800,
    unit: 'g',
    purchaseDate: getOffsetDate(-14),
    expiryDate: getOffsetDate(60),
    storageLocation: 'Pantry Jar',
    cost: 95
  },
  {
    id: 'inv-7',
    name: 'Potato',
    category: 'Vegetables',
    quantity: 1,
    unit: 'kg',
    purchaseDate: getOffsetDate(-5),
    expiryDate: getOffsetDate(14),
    storageLocation: 'Pantry Basket',
    cost: 35
  },
  {
    id: 'inv-8',
    name: 'Curd (Yogurt)',
    category: 'Dairy',
    quantity: 400,
    unit: 'ml',
    purchaseDate: getOffsetDate(-1),
    expiryDate: getOffsetDate(3),
    storageLocation: 'Fridge',
    cost: 35
  },
  {
    id: 'inv-9',
    name: 'Paneer',
    category: 'Dairy',
    quantity: 200,
    unit: 'g',
    purchaseDate: getOffsetDate(-1),
    expiryDate: getOffsetDate(4),
    storageLocation: 'Fridge',
    cost: 90
  },
  {
    id: 'inv-10',
    name: 'Carrot',
    category: 'Vegetables',
    quantity: 300,
    unit: 'g',
    purchaseDate: getOffsetDate(-3),
    expiryDate: getOffsetDate(5),
    storageLocation: 'Fridge',
    cost: 20
  },
  {
    id: 'inv-11',
    name: 'Green Chilli',
    category: 'Vegetables',
    quantity: 100,
    unit: 'g',
    purchaseDate: getOffsetDate(-4),
    expiryDate: getOffsetDate(6),
    storageLocation: 'Fridge',
    cost: 10
  },
  {
    id: 'inv-12',
    name: 'Cooking Oil',
    category: 'Spices & Oils',
    quantity: 1,
    unit: 'L',
    purchaseDate: getOffsetDate(-20),
    expiryDate: getOffsetDate(120),
    storageLocation: 'Pantry Shelf',
    cost: 140
  }
];

export const INVENTORY_CATEGORIES = [
  'All',
  'Vegetables',
  'Grains',
  'Protein',
  'Dairy',
  'Spices & Oils',
  'Snacks'
];
