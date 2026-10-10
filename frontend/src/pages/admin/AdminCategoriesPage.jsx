import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Modal } from '../../components/common/Modal';

export const AdminCategoriesPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🥗');
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setIcon('🥗');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || '🥗');
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        icon,
        description
      });
    } else {
      addCategory({
        name: name.trim(),
        icon,
        description
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>🏷️ Category & Diet Taxonomy CRUD</h2>
            <span className="badge badge-info">{categories.length} Categories</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage food classifications, regional groups, and dietary constraints for the AI engine.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          + Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon || '🏷️'}</span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {cat.recipeCount || 4} linked recipes
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.4, minHeight: '38px' }}>
              {cat.description || 'Nutritional category classification.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => openEditModal(cat)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete category "${cat.name}"?`)) deleteCategory(cat.id);
                }}
                className="btn btn-danger btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Food Category'}
        maxWidth="480px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Emoji</label>
              <input
                type="text"
                className="form-input"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. South Indian"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Brief description of recipes matching this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
