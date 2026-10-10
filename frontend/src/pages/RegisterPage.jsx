import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER', // 'USER' or 'ADMIN'
    ageGroup: '26-35',
    foodPreference: 'South Indian & North Indian Mix',
    dietaryPreference: 'Vegetarian (Eggs Allowed)',
    primaryGoal: 'Healthy Eating'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      if (res && res.success) {
        setSuccessMsg('Account created successfully! 🎉');

        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess(res.user);
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
      padding: '30px 16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Set up your AI personalized food preferences and goals
          </p>
        </div>
        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '10px', fontSize: '0.82rem' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div
            style={{
              background: '#d1fae5',
              color: '#065f46',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textAlign: 'center',
              border: '1px solid #a7f3d0'
            }}
          >
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Account Type / Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                border: formData.role === 'USER' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                background: formData.role === 'USER' ? '#ecfdf5' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={handleChange}
                />
                <span>👤 Standard User</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                border: formData.role === 'ADMIN' ? '1.5px solid #3b82f6' : '1px solid var(--border)',
                background: formData.role === 'ADMIN' ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={formData.role === 'ADMIN'}
                  onChange={handleChange}
                />
                <span>🛡️ Administrator</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="e.g. johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              🎯 Personalization Parameters
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age Group</label>
              <select name="ageGroup" className="form-select" value={formData.ageGroup} onChange={handleChange}>
                <option value="18-25">18 - 25 years</option>
                <option value="26-35">26 - 35 years</option>
                <option value="36-50">36 - 50 years</option>
                <option value="50+">50+ years (Senior)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Food Preference</label>
              <select name="foodPreference" className="form-select" value={formData.foodPreference} onChange={handleChange}>
                <option value="South Indian">South Indian Focus</option>
                <option value="North Indian">North Indian Focus</option>
                <option value="South Indian & North Indian Mix">Mix (South & North)</option>
                <option value="Pan-Indian">Pan-Indian Homestyle</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Dietary Preference</label>
              <select name="dietaryPreference" className="form-select" value={formData.dietaryPreference} onChange={handleChange}>
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Vegetarian (Eggs Allowed)">Vegetarian (Eggs Allowed)</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Primary Goal</label>
              <select name="primaryGoal" className="form-select" value={formData.primaryGoal} onChange={handleChange}>
                <option value="Healthy Eating">🥗 Healthy Eating</option>
                <option value="Fitness">💪 Fitness / High Protein</option>
                <option value="Weight Management">⚖️ Weight Management</option>
                <option value="Quick Meals">⏱️ Quick Meals (15-20 min)</option>
                <option value="Family Meals">👨‍👩‍👧 Family Meals</option>
                <option value="Regular Home Food">🍱 Regular Home Food</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '12px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration ➔'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};
