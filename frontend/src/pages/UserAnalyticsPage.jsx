import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { SimplePieChart } from '../components/charts/SimplePieChart';

export const UserAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const { analyticsData, mealHistory } = useAppState();

  const mealStatusChartData = [
    { label: 'Completed', value: analyticsData.completedMeals, color: '#10b981' },
    { label: 'Skipped', value: analyticsData.skippedMeals, color: '#ef4444' },
    { label: 'Rescheduled', value: analyticsData.rescheduledMeals, color: '#8b5cf6' },
    { label: 'Upcoming', value: Math.max(analyticsData.totalMealsPlanned - analyticsData.completedMeals - analyticsData.skippedMeals, 4), color: '#3b82f6' }
  ];

  const categoryDistributionData = [
    { label: 'South Indian', value: 9, color: '#10b981' },
    { label: 'North Indian', value: 6, color: '#f59e0b' },
    { label: 'Fitness & Protein', value: 4, color: '#3b82f6' },
    { label: 'Quick Meals', value: 5, color: '#8b5cf6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📊 My Meal Analytics & Eco Insights</h2>
          <span className="ai-badge">Food Waste Reduction</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Personalized tracking of domestic food waste prevention, adherence rate, and AI learning signals.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Food Waste Avoided"
          value={`${analyticsData.foodWasteAvoidedKg} kg`}
          subtitle="Saved from landfill spoilage"
          icon="♻️"
          iconBg="#d1fae5"
          trend="+1.2 kg this week"
          trendColor="#059669"
        />
        <StatCard
          title="Money Saved"
          value={`₹${analyticsData.estimatedMoneySaved}`}
          subtitle="From net-deficit grocery planning"
          icon="💰"
          iconBg="#fef3c7"
          trend="Pantry-optimized"
          trendColor="#d97706"
        />
        <StatCard
          title="Completion Rate"
          value={`${analyticsData.completionRate}%`}
          subtitle={`${analyticsData.completedMeals} meals cooked`}
          icon="📈"
          iconBg="#dbeafe"
          trend="High Adherence"
          trendColor="#1d4ed8"
        />
        <StatCard
          title="Items Rescued"
          value={analyticsData.expiringItemsSaved}
          subtitle="Used before expiry dates"
          icon="🛡️"
          iconBg="#ede9fe"
          trend="Zero Spoilage"
          trendColor="#7c3aed"
        />
      </div>

      {/* AI Personalization Insight Box */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ede9fe 100%)',
        border: '1.5px solid #a7f3d0',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🧠</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
            AI Preference Learning Profile: {currentUser?.name || 'Priya'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.84rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.85)', padding: '12px', borderRadius: '10px' }}>
            <span style={{ color: '#64748b' }}>Favorite Recipe:</span>
            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Crispy Dosa with Coconut Chutney ⭐ 5.0
            </div>
            <p style={{ color: '#059669', fontSize: '0.75rem', marginTop: '4px' }}>
              Based on your repeated 5-star ratings and 15-min cooking times.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', padding: '12px', borderRadius: '10px' }}>
            <span style={{ color: '#64748b' }}>Primary Cuisine Affinity:</span>
            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              South Indian & High-Protein Breakfasts
            </div>
            <p style={{ color: '#2563eb', fontSize: '0.75rem', marginTop: '4px' }}>
              65% of your completed meals match this profile.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', padding: '12px', borderRadius: '10px' }}>
            <span style={{ color: '#64748b' }}>Adaptive Skip Pattern:</span>
            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Common Skip Reason: "No time"
            </div>
            <p style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '4px' }}>
              The engine automatically favors ≤15 min recipes when busy.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <SimpleBarChart
          title="Meal Outcomes Breakdown (Planned vs Cooked vs Skipped)"
          data={mealStatusChartData}
          height={200}
        />
        <SimplePieChart
          title="Dietary & Cuisine Distribution"
          data={categoryDistributionData}
        />
      </div>

      {/* Food Waste Reduction Action Cards */}
      <div className="glass-card dashboard-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
          ♻️ Food Waste Reduction System Insights
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              icon: '🍅',
              title: 'Ingredients Used Before Expiry',
              msg: 'You cooked 8 perishable ingredients (including Tomatoes, Spinach, and Paneer) within 48 hours of expiration, directly eliminating kitchen waste.'
            },
            {
              icon: '🥬',
              title: 'Frequent Spoilage Warning',
              msg: 'System noticed you purchase spinach frequently but postpone cooking it past 3 days. RecipeMate now prompts 1-click Palak Dal recipes on Day 2.'
            },
            {
              icon: '🛒',
              title: 'Net-Deficit Grocery Impact',
              msg: 'By deducting your 2 kg pantry rice and 800g toor dal, your grocery bill was ₹480 lighter this month without any surplus hoarding.'
            }
          ].map((insight, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{insight.icon}</span>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{insight.title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: '3px', lineHeight: 1.4 }}>
                  {insight.msg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
