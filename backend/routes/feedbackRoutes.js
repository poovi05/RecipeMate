import express from 'express';
import {
  getFeedback,
  submitFeedback,
  getMealHistory,
  logMealHistory
} from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', getFeedback);
router.post('/', submitFeedback);
router.get('/history', getMealHistory);
router.post('/history', logMealHistory);

export default router;
