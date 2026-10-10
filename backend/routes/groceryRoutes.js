import express from 'express';
import {
  getGrocery,
  saveGrocery,
  updateGroceryItem,
  deleteGroceryItem,
  clearCompletedItems,
  generateFromMealPlan
} from '../controllers/groceryController.js';

const router = express.Router();

router.get('/', getGrocery);
router.post('/', saveGrocery);
router.post('/generate-from-plan', generateFromMealPlan);
router.delete('/clear-completed', clearCompletedItems);
router.put('/:id', updateGroceryItem);
router.delete('/:id', deleteGroceryItem);

export default router;
