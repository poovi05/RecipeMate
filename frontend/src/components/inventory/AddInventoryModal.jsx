import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { INVENTORY_CATEGORIES } from '../../constants/config';

export const AddInventoryModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('kg');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [storageLocation, setStorageLocation] = useState('Fridge');

  const popularQuickAdds = ['Tomato', 'Onion', 'Egg', 'Rice', 'Potato', 'Paneer', 'Spinach', 'Toor Dal'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit,
      expiryDate,
      storageLocation,
      cost: Math.round(Number(quantity) * 35)
    });

    setName('');
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📦 Add Kitchen Inventory Item" maxWidth="500px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Quick Add Pills */}
        <div>
          <label className="form-label">Quick Suggestions</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {popularQuickAdds.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setName(item)}
                style={{
                  background: name === item ? 'var(--primary-light)' : '#f1f5f9',
                  color: name === item ? 'var(--primary-dark)' : '#475569',
                  border: name === item ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + {item}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ingredient / Item Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Fresh Tomatoes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {INVENTORY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Storage Location</label>
            <select
              className="form-select"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
            >
              <option value="Fridge">Fridge</option>
              <option value="Pantry Shelf">Pantry Shelf</option>
              <option value="Countertop">Countertop</option>
              <option value="Freezer">Freezer</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit</label>
            <select
              className="form-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="pcs">pcs</option>
              <option value="ml">ml</option>
              <option value="L">L</option>
              <option value="packet">packet</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Expiry Date</label>
          <input
            type="date"
            className="form-input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Item
          </button>
        </div>
      </form>
    </Modal>
  );
};
