import { dataStore } from '../models/dataStore.js';

export const getNotifications = (req, res) => {
  try {
    const notifs = dataStore.getNotifications();
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNotification = (req, res) => {
  try {
    const { type, title, message, actionUrl } = req.body;
    const notifs = dataStore.getNotifications();

    const newNotif = {
      id: `notif-${Date.now()}`,
      type: type || 'meal', // 'meal' | 'grocery' | 'expiry' | 'reschedule'
      title: title || 'New Reminder',
      message: message || '',
      time: 'Just now',
      unread: true,
      actionUrl: actionUrl || 'dashboard'
    };

    notifs.unshift(newNotif);
    dataStore.saveNotifications(notifs);
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = (req, res) => {
  try {
    const notifs = dataStore.getNotifications();
    const idx = notifs.findIndex(n => n.id === req.params.id);
    if (idx !== -1) {
      notifs[idx].unread = false;
      dataStore.saveNotifications(notifs);
    }
    res.json({ success: true, notification: notifs[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearNotifications = (req, res) => {
  try {
    dataStore.saveNotifications([]);
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
