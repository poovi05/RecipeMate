import express from 'express';
import {
  getMealPlans,
  saveMealPlans,
  updateMealSlot,
  removeMealFromSlot,
  generateSmartPlan
} from '../controllers/mealPlanController.js';

const router = express.Router();

router.get('/', getMealPlans);
router.post('/', saveMealPlans);
router.post('/generate', generateSmartPlan);
router.put('/:dayIndex/:slotKey', updateMealSlot);
router.delete('/:dayIndex/:slotKey', removeMealFromSlot);

export default router;
