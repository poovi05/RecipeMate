import express from 'express';
import { getRecommendations, suggestAlternative } from '../controllers/aiController.js';

const router = express.Router();

router.post('/recommend', getRecommendations);
router.post('/alternative', suggestAlternative);

export default router;
