import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Context
import { AuthProvider } from './context/AuthContext';

// User Context
import { UserAuthProvider } from './context/UserAuthContext';
import { CartProvider } from './context/CartContext';

// Admin Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import AddEditProduct from './admin/pages/AddEditProduct';
import Orders from './admin/pages/Orders';

// User Components
import UserLayout from './layouts/UserLayout';

// User Pages
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ShopPage from './pages/ShopPage';
import TrackOrder from './pages/TrackOrder'; // ✅ ADD THIS

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>

              {/* ===== USER ROUTES ===== */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/* CART + CHECKOUT */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* ORDERS */}
                <Route path="/orders" element={<OrdersPage />} />

                {/* ✅ TRACK ORDER (NEW) */}
                <Route path="/track/:id" element={<TrackOrder />} />
              </Route>

              {/* ===== ADMIN ROUTES ===== */}

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/add" element={<AddEditProduct />} />
                  <Route path="products/edit/:id" element={<AddEditProduct />} />
                  <Route path="orders" element={<Orders />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>

          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </CartProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;