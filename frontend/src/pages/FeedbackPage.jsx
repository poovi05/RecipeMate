import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';

export const FeedbackPage = () => {
  const { currentUser } = useAuth();
  const { feedbackList, setFeedbackList, recipes } = useAppState();

  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [relatedRecipe, setRelatedRecipe] = useState(recipes && recipes.length > 0 ? recipes[0]?.name : '');
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFeedback = {
      id: `fb-${Date.now()}`,
      userName: currentUser?.name || 'User',
      userEmail: currentUser?.email || 'user@example.com',
      recipeName: feedbackType === 'Recipe Feedback' ? (relatedRecipe || 'General Dish') : feedbackType,
      rating,
      type: feedbackType,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setFeedbackList([newFeedback, ...(feedbackList || [])]);
    setComment('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>💬 Feedback & Learning Loop</h2>
          <span className="ai-badge">Preference Training</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          User feedback continuously fine-tunes recipe scoring and eliminates repetitive dishes.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Share Your Cooking or Planning Experience
        </h3>

        {successMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '0.86rem',
            marginBottom: '16px'
          }}>
            🎉 Thank you! Your feedback has been recorded.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Feedback Category</label>
              <select
                className="form-select"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
              >
                <option value="General Feedback">💡 General System Feedback</option>
                <option value="Recipe Feedback">🍲 Specific Recipe Feedback</option>
                <option value="Meal Planner Feedback">📅 AI Meal Planner Experience</option>
                <option value="Grocery Engine Feedback">🛒 Smart Grocery Deductions</option>
              </select>
            </div>

            {feedbackType === 'Recipe Feedback' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Recipe</label>
                {recipes && recipes.length > 0 ? (
                  <select
                    className="form-select"
                    value={relatedRecipe}
                    onChange={(e) => setRelatedRecipe(e.target.value)}
                  >
                    {recipes.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.category})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter recipe name..."
                    value={relatedRecipe}
                    onChange={(e) => setRelatedRecipe(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Satisfaction Rating</label>
            <div style={{ display: 'flex', gap: '10px', fontSize: '1.8rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? '#f59e0b' : '#cbd5e1' }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '0.9rem', color: '#64748b', alignSelf: 'center', marginLeft: '6px' }}>
                ({rating} out of 5 stars)
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Detailed Comments & Taste Experience</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Spice balance was great, enjoyed cooking this dish..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              🚀 Submit Feedback
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Feedback Stream or Empty State */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
          Recent Feedback Logs ({(feedbackList || []).length})
        </h3>

        {(!feedbackList || feedbackList.length === 0) ? (
          <div className="glass-card" style={{
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '2.5rem' }}>💬</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No feedback submitted yet</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px' }}>
              Submit your first review above to train the personalization engine with your taste preferences.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="glass-card"
                style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-info">{fb.type}</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{fb.date}</span>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{fb.recipeName}</h4>
                  <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '2px' }}>
                    {'★'.repeat(fb.rating)} ({fb.rating}/5)
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{fb.comment}"
                </p>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 'auto', paddingTop: '6px' }}>
                  By: {fb.userName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
