import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProduceDetails from '../pages/ProduceDetails';
import FarmDetails from '../pages/FarmDetails';
import CartPage from '../pages/CartPage';
import CartCheckout from '../pages/CartCheckout';
import CustomerDashboard from '../pages/CustomerDashboard';
import CustomerOrders from '../pages/CustomerOrders';
import CustomerProfile from '../pages/CustomerProfile';
import WishlistPage from '../pages/WishlistPage';
import Settings from '../pages/Settings';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import FarmerDashboard from '../pages/FarmerDashboard';
import FarmerOnboarding from '../pages/FarmerOnboarding';
import AdminDashboard from '../pages/AdminDashboard';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-slate-400">Loading platform credentials...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/produce/:id" element={<ProduceDetails />} />
      <Route path="/farmer/public/:id" element={<FarmDetails />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Customer Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <CartCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Farmer Routes */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/onboarding"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <FarmerOnboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
