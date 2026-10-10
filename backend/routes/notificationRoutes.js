import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  clearNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);
router.delete('/clear', clearNotifications);

export default router;
