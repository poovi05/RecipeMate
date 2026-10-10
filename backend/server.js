import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { dataStore } from './models/dataStore.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for MCA student demonstration
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📡 ${req.method} ${req.url}`);
  next();
});

// System Health & Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'RecipeMate – Food Recipes, Meal Planner and Grocery Management',
    type: 'Web-based MCA Academic Project',
    architecture: 'Express REST API + Clean DataStore Layer',
    timestamp: new Date().toISOString(),
    databaseMetrics: {
      totalUsers: dataStore.getUsers().length,
      totalRecipes: dataStore.getRecipes().length,
      pantryStock: dataStore.getInventory().length,
      activePlans: dataStore.getMealPlans().length,
      groceryItems: dataStore.getGrocery().length,
      feedbackCount: dataStore.getFeedback().length,
      notifications: dataStore.getNotifications().length
    }
  });
});

// Register Modular REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🍲 RecipeMate REST API Server Running`);
  console.log(`🔗 Address: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📂 Database Model: backend/models/dataStore.js`);
  console.log(`💾 Persisted Store: backend/data/store.json`);
  console.log(`=======================================================`);
});

export default app;
