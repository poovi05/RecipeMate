import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';
import { AddInventoryModal } from '../components/inventory/AddInventoryModal';
import { ExpiryWarningBanner } from '../components/inventory/ExpiryWarningBanner';
import { INVENTORY_CATEGORIES } from '../constants/config';

export const InventoryPage = ({ setActiveTab }) => {
  const { inventory, addInventoryItem, deleteInventoryItem, updateInventoryItem, getExpiringItems } = useAppState();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const expiringItems = getExpiringItems();

  const filteredInventory = useMemo(() => {
    return (inventory || []).filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [inventory, searchTerm, selectedCategory]);

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📦 My Kitchen Inventory</h2>
            <span className="badge badge-success">{inventory.length} items logged</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Tracks pantry staples and fridge groceries to calculate net grocery deficits and prevent spoilage.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          + Add Kitchen Item
        </button>
      </div>

      {/* Expiry Warning Banner (Only when actual expiring items exist!) */}
      {expiringItems.length > 0 && (
        <ExpiryWarningBanner
          expiringItems={expiringItems}
          onFindRecipes={() => {
            setActiveTab('recipes');
          }}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '320px' }}
          placeholder="🔍 Search items (e.g. Tomato)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {INVENTORY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--primary-light)' : '#ffffff',
                color: selectedCategory === cat ? 'var(--primary-dark)' : '#475569',
                fontSize: '0.8rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Table / Empty State */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pantry & Fridge Stock</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filteredInventory.length} items
          </span>
        </div>

        {filteredInventory.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '3rem' }}>📦</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your kitchen pantry is empty</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
              Add ingredients currently in your fridge or pantry. RecipeMate will track their expiry and deduct them from your future grocery lists.
            </p>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ marginTop: '8px' }}>
              + Add First Kitchen Item
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 20px' }}>Item Name</th>
                  <th style={{ padding: '12px 20px' }}>Category</th>
                  <th style={{ padding: '12px 20px' }}>In Stock Quantity</th>
                  <th style={{ padding: '12px 20px' }}>Storage</th>
                  <th style={{ padding: '12px 20px' }}>Expiry Status</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const daysLeft = getDaysLeft(item.expiryDate);
                  const isExpiring = daysLeft !== null && daysLeft <= 2 && daysLeft >= 0;
                  const isExpired = daysLeft !== null && daysLeft < 0;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: isExpiring ? '#fffbeb' : 'transparent',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="badge badge-neutral">{item.category}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                        {item.quantity} {item.unit}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>
                        {item.storageLocation || 'Kitchen'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {isExpired ? (
                          <span className="badge badge-danger">Expired</span>
                        ) : isExpiring ? (
                          <span className="badge badge-danger">
                            ⚠️ Expires in {daysLeft === 0 ? 'Today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            {daysLeft} days left
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {isExpiring && (
                            <button
                              onClick={() => setActiveTab('recipes')}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                            >
                              Find Recipes
                            </button>
                          )}
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addInventoryItem}
      />
    </div>
  );
};
