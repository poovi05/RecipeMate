import { dataStore } from '../models/dataStore.js';

export const getInventory = (req, res) => {
  try {
    const items = dataStore.getInventory();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addInventoryItem = (req, res) => {
  try {
    const { name, category, quantity, unit, storageLocation, expiryDate } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name is required' });

    const inventory = dataStore.getInventory();
    const newItem = {
      id: `inv-${Date.now()}`,
      name,
      category: category || 'Vegetables',
      quantity: Number(quantity) || 1,
      unit: unit || 'kg',
      storageLocation: storageLocation || 'Pantry Shelf',
      expiryDate: expiryDate || null,
      purchaseDate: new Date().toISOString().split('T')[0]
    };

    inventory.unshift(newItem);
    dataStore.saveInventory(inventory);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventoryItem = (req, res) => {
  try {
    const inventory = dataStore.getInventory();
    const idx = inventory.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Inventory item not found' });

    inventory[idx] = { ...inventory[idx], ...req.body };
    dataStore.saveInventory(inventory);
    res.json(inventory[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInventoryItem = (req, res) => {
  try {
    let inventory = dataStore.getInventory();
    inventory = inventory.filter(i => i.id !== req.params.id);
    dataStore.saveInventory(inventory);
    res.json({ success: true, message: 'Inventory item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
