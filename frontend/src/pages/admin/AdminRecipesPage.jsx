import React, { useState, useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Modal } from '../../components/common/Modal';

export const AdminRecipesPage = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, categories } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('South Indian');
  const [cookingTime, setCookingTime] = useState(20);
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState(2);
  const [dietType, setDietType] = useState('Vegetarian');
  const [calories, setCalories] = useState(250);
  const [protein, setProtein] = useState('10g');
  const [imageEmoji, setImageEmoji] = useState('🍲');
  const [ingredientsText, setIngredientsText] = useState('Tomato (2 pcs)\nOnion (1 pcs)\nCooking Oil (1 tbsp)');
  const [stepsText, setStepsText] = useState('Heat oil in pan.\nAdd chopped onions and tomatoes.\nCook until soft and serve hot.');

  const openCreateModal = () => {
    setEditingRecipe(null);
    setName('');
    setCategory('South Indian');
    setCookingTime(20);
    setDifficulty('Easy');
    setServings(2);
    setDietType('Vegetarian');
    setCalories(250);
    setProtein('10g');
    setImageEmoji('🍲');
    setIngredientsText('Tomato (2 pcs)\nOnion (1 pcs)\nCooking Oil (1 tbsp)');
    setStepsText('Heat oil in pan.\nAdd chopped onions and tomatoes.\nCook until soft and serve hot.');
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingRecipe(r);
    setName(r.name);
    setCategory(r.category);
    setCookingTime(r.cookingTime);
    setDifficulty(r.difficulty);
    setServings(r.servings);
    setDietType(r.dietType || 'Vegetarian');
    setCalories(r.calories || 250);
    setProtein(r.protein || '10g');
    setImageEmoji(r.imageEmoji || '🍲');
    setIngredientsText(r.ingredients.map(i => `${i.name} (${i.amount} ${i.unit})`).join('\n'));
    setStepsText(r.steps.join('\n'));
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Parse ingredients from lines
    const parsedIngredients = ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const match = line.match(/^([^(]+)(?:\(([\d.]+)\s*(\w+)\))?/);
        if (match) {
          return {
            name: match[1].trim(),
            amount: match[2] ? Number(match[2]) : 1,
            unit: match[3] ? match[3].trim() : 'pcs'
          };
        }
        return { name: line, amount: 1, unit: 'pcs' };
      });

    const parsedSteps = stepsText.split('\n').map(s => s.trim()).filter(Boolean);

    const recipePayload = {
      name: name.trim(),
      category,
      regionalCategory: category,
      cookingTime: Number(cookingTime),
      difficulty,
      servings: Number(servings),
      dietType,
      calories: Number(calories),
      protein,
      imageEmoji,
      goalTags: [category, difficulty === 'Easy' ? 'Quick & Easy' : 'Family Meals'],
      ingredients: parsedIngredients,
      steps: parsedSteps
    };

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipePayload);
    } else {
      addRecipe(recipePayload);
    }

    setIsModalOpen(false);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [recipes, searchTerm, categoryFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>🍲 Recipe Catalog Management</h2>
            <span className="badge badge-success">{recipes.length} Dishes</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Add, update, or remove authentic Indian recipes, adjust cooking times, and specify exact ingredients.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          + Add New Recipe
        </button>
      </div>

      {/* Search & Filter */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '320px' }}
          placeholder="🔍 Search recipe by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'South Indian', 'North Indian', 'Quick & Easy', 'Fitness'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: categoryFilter === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: categoryFilter === cat ? 'var(--primary-light)' : '#ffffff',
                color: categoryFilter === cat ? 'var(--primary-dark)' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Dish Name</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Cook Time</th>
                <th style={{ padding: '14px 20px' }}>Difficulty</th>
                <th style={{ padding: '14px 20px' }}>Diet</th>
                <th style={{ padding: '14px 20px' }}>Ingredients</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{r.imageEmoji || '🍲'}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          ⭐ {r.rating || 4.8} ({r.reviewsCount || 20} ratings)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="badge badge-neutral">{r.category}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    ⏱️ {r.cookingTime} min
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="badge badge-info">{r.difficulty}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${r.dietType === 'Vegetarian' ? 'badge-success' : 'badge-danger'}`}>
                      {r.dietType || 'Vegetarian'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.8rem' }}>
                    {r.ingredients.length} items
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete recipe "${r.name}"?`)) deleteRecipe(r.id);
                        }}
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Recipe Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecipe ? `✏️ Edit Recipe: ${editingRecipe.name}` : '🍲 Add New Indian Recipe'}
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Recipe Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Masala Dosa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Emoji</label>
              <input
                type="text"
                className="form-input"
                value={imageEmoji}
                onChange={(e) => setImageEmoji(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="Quick & Easy">Quick & Easy</option>
                <option value="Fitness">Fitness & Protein</option>
                <option value="Healthy">Healthy Eating</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cook Time (min)</label>
              <input
                type="number"
                className="form-input"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Diet Type</label>
              <select className="form-select" value={dietType} onChange={(e) => setDietType(e.target.value)}>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                className="form-input"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Protein</label>
              <input
                type="text"
                className="form-input"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Ingredients (One per line: "Name (amount unit)")</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Preparation Steps (One per line)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
