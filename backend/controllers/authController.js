import { dataStore } from '../models/dataStore.js';

export const register = (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      role,
      ageGroup,
      foodPreference,
      dietaryPreference,
      primaryGoal
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const users = dataStore.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      username: username || email.split('@')[0],
      password,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      avatar: role === 'ADMIN' ? '🛡️' : '👨‍🍳',
      ageGroup: ageGroup || '26-35',
      foodPreference: foodPreference || 'South Indian & North Indian Mix',
      dietaryPreference: dietaryPreference || 'Vegetarian (Eggs Allowed)',
      primaryGoal: primaryGoal || 'Healthy Eating',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    dataStore.saveUsers(users);

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({ success: true, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = dataStore.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please register if you are a new user.'
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated by an administrator.'
      });
    }

    const { password: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const users = dataStore.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    delete updates.password; // Do not overwrite password directly here
    users[idx] = { ...users[idx], ...updates };
    dataStore.saveUsers(users);

    const { password: _, ...userSafe } = users[idx];
    res.json({ success: true, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
