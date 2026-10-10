import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import RecipeRecommendationPage from "./pages/RecipeRecommendationPage";
import { MealPlannerPage } from './pages/MealPlannerPage';
import { InventoryPage } from './pages/InventoryPage';
import { GroceryListPage } from './pages/GroceryListPage';
import { RemindersPage } from './pages/RemindersPage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { UserAnalyticsPage } from './pages/UserAnalyticsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRecipesPage } from './pages/admin/AdminRecipesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminMealPlansPage } from './pages/admin/AdminMealPlansPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

const AppContent = () => {
  const { currentUser, isAdmin } = useAuth();
  // Default to user dashboard if user is authenticated, else landing
  const [activeTab, setActiveTab] = useState(() => (currentUser ? (currentUser.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard') : 'landing'));

  // Public views
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setActiveTab('dashboard')}
        onAdminDemo={() => setActiveTab('admin-dashboard')}
        onSwitchToLogin={() => setActiveTab('login')}
        onSwitchToRegister={() => setActiveTab('register')}
      />
    );
  }

  if (activeTab === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setActiveTab('register')}
        onLoginSuccess={(user) => {
          setActiveTab(user.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
        }}
      />
    );
  }

  if (activeTab === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setActiveTab('login')}
        onRegisterSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, padding: '28px 36px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
          {/* User Routes */}
          {activeTab === 'dashboard' && <UserDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'recipes' && <RecipeRecommendationPage />}
          {activeTab === 'planner' && <MealPlannerPage setActiveTab={setActiveTab} />}
          {activeTab === 'inventory' && <InventoryPage setActiveTab={setActiveTab} />}
          {activeTab === 'grocery' && <GroceryListPage />}
          {activeTab === 'reminders' && <RemindersPage setActiveTab={setActiveTab} />}
          {activeTab === 'history' && <MealHistoryPage />}
          {activeTab === 'feedback' && <FeedbackPage />}
          {activeTab === 'analytics' && <UserAnalyticsPage />}

          {/* Admin Routes */}
          {activeTab === 'admin-dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'admin-users' && <AdminUsersPage />}
          {activeTab === 'admin-recipes' && <AdminRecipesPage />}
          {activeTab === 'admin-categories' && <AdminCategoriesPage />}
          {activeTab === 'admin-mealplans' && <AdminMealPlansPage />}
          {activeTab === 'admin-feedback' && <AdminFeedbackPage />}
          {activeTab === 'admin-reports' && <AdminReportsPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </AuthProvider>
  );
}
