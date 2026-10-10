import express from 'express';
import {
  getMetrics,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  resetToDemoData
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/metrics', getMetrics);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/reset-demo', resetToDemoData);

export default router;
