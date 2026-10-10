import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';

const GROCERY_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Spices',
  'Meat/Egg',
  'Other'
];

export const GroceryListPage = ({ setActiveTab }) => {
  const {
    groceryList,
    toggleGroceryPurchased,
    addGroceryItem,
    deleteGroceryItem,
    clearCompletedGrocery,
    refreshGroceryFromPlan
  } = useAppState();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemCat, setNewItemCat] = useState('Vegetables');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addGroceryItem({
      name: newItemName.trim(),
      category: newItemCat,
      quantityToBuy: Number(newItemQty),
      demand: Number(newItemQty),
      unit: newItemUnit,
      inStock: 0,
      purchased: false,
      estimatedCost: Math.max(15, Math.round(Number(newItemQty) * 25))
    });

    setNewItemName('');
    setNewItemQty(1);
  };

  // Group items strictly according to the required 7 categories
  const groupedGrocery = useMemo(() => {
    const groups = {
      'Vegetables': [],
      'Fruits': [],
      'Grains': [],
      'Dairy': [],
      'Spices': [],
      'Meat/Egg': [],
      'Other': []
    };

    (groceryList || []).forEach((item) => {
      let cat = item.category || 'Other';
      if (cat === 'Grains & Pulses') cat = 'Grains';
      if (cat === 'Protein') cat = 'Meat/Egg';
      if (cat === 'Spices & Staples') cat = 'Spices';

      if (groups[cat]) {
        groups[cat].push(item);
      } else {
        groups['Other'].push(item);
      }
    });

    return groups;
  }, [groceryList]);

  const totalCost = (groceryList || []).reduce((acc, curr) => acc + (curr.estimatedCost || 25), 0);
  const completedCount = (groceryList || []).filter((g) => g.purchased).length;
  const pendingCount = (groceryList || []).length - completedCount;

  return (
    <div className="user-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>🛒 Smart Grocery Management</h2>
            <span className="badge badge-success">Net Deficit Engine</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Automatically combines meal plan ingredients, eliminates duplicates, and deducts items already in your kitchen pantry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {completedCount > 0 && (
            <button
              onClick={clearCompletedGrocery}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
              title="Remove purchased items"
            >
              🧹 Clear Completed ({completedCount})
            </button>
          )}

          <button onClick={refreshGroceryFromPlan} className="btn btn-primary btn-sm">
            🔄 Auto-Generate From Meal Plan
          </button>
        </div>
      </div>

      {/* Intelligent Deficit Explainer Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)',
        border: '1.5px solid #a7f3d0',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
            🧠 Zero-Waste Net-Deficit Algorithm
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#166534', marginTop: '4px', maxWidth: '640px', lineHeight: 1.4 }}>
            Aggregates total recipe requirements across your week and subtracts in-stock pantry items.
            Only what you actually lack is placed on this shopping list—preventing duplicate buying and household food decay.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Estimated Budget</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>₹{totalCost}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Pending / Total</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: pendingCount === 0 ? '#10b981' : '#2563eb' }}>
              {pendingCount} / {(groceryList || []).length}
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Grocery Item */}
      <form onSubmit={handleAddItem} className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 2, minWidth: '180px' }}
          placeholder="+ Add custom item (e.g. Cardamom, Brown Rice, Coconut)..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          min="0.1"
          className="form-input"
          style={{ width: '90px' }}
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
        />
        <select
          className="form-select"
          style={{ width: '100px' }}
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="pcs">pcs</option>
          <option value="L">L</option>
          <option value="ml">ml</option>
          <option value="tsp">tsp</option>
          <option value="tbsp">tbsp</option>
        </select>
        <select
          className="form-select"
          style={{ width: '150px' }}
          value={newItemCat}
          onChange={(e) => setNewItemCat(e.target.value)}
        >
          {GROCERY_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">
          + Add Item
        </button>
      </form>

      {/* Grouped Grocery Sections or Empty State */}
      {(!groceryList || groceryList.length === 0) ? (
        <div className="glass-card" style={{
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your grocery list is empty</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px', lineHeight: 1.5 }}>
            Generate a weekly meal plan in the <strong>Meal Planner</strong>, then click <strong>"Auto-Generate From Meal Plan"</strong> to automatically compile missing items. You can also manually add items above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(groupedGrocery).map(([categoryName, items]) => {
            if (items.length === 0) return null;

            const catIcons = {
              'Vegetables': '🥬',
              'Fruits': '🍎',
              'Grains': '🌾',
              'Dairy': '🥛',
              'Spices': '🧂',
              'Meat/Egg': '🥚',
              'Other': '📦'
            };

            return (
              <div key={categoryName} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{catIcons[categoryName] || '🛒'}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{categoryName}</h3>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {items.length} items
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {items.filter(i => i.purchased).length} purchased
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: item.purchased ? '#f1f5f9' : '#ffffff',
                        border: '1px solid var(--border)',
                        opacity: item.purchased ? 0.65 : 1,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={() => toggleGroceryPurchased(item.id)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <span style={{
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            textDecoration: item.purchased ? 'line-through' : 'none',
                            color: item.purchased ? '#64748b' : '#0f172a'
                          }}>
                            {item.name}
                          </span>
                          {item.inStock > 0 && (
                            <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '2px' }}>
                              ✓ {item.inStock} {item.unit} already in pantry (Total needed: {item.demand || (item.quantityToBuy + item.inStock)} {item.unit})
                            </div>
                          )}
                        </div>
                      </label>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            {item.quantityToBuy} {item.unit}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            ~₹{item.estimatedCost || 30}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteGroceryItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            padding: '4px'
                          }}
                          title="Remove Item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
