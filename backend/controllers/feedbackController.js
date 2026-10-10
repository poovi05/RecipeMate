import { dataStore } from '../models/dataStore.js';

export const getFeedback = (req, res) => {
  try {
    const feedback = dataStore.getFeedback();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitFeedback = (req, res) => {
  try {
    const { userName, recipeName, rating, type, comment, reason } = req.body;
    const feedback = dataStore.getFeedback();

    const newFb = {
      id: `fb-${Date.now()}`,
      userName: userName || 'Demo User',
      recipeName: recipeName || 'General Feedback',
      rating: rating || 5,
      type: type || 'Recipe Feedback',
      comment: comment || reason || 'Meal logged successfully',
      date: new Date().toISOString().split('T')[0]
    };

    feedback.unshift(newFb);
    dataStore.saveFeedback(feedback);
    res.status(201).json(newFb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMealHistory = (req, res) => {
  try {
    const history = dataStore.getMealHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logMealHistory = (req, res) => {
  try {
    const history = dataStore.getMealHistory();
    const entry = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...req.body
    };
    history.unshift(entry);
    dataStore.saveMealHistory(history);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
