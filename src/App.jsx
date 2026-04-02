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
import UserProtectedRoute from './components/UserProtectedRoute';

// User Pages
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';

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
                <Route path="/product/:id" element={<ProductDetail />} />

                <Route element={<UserProtectedRoute />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Route>
              </Route>

              {/* USER AUTH */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignup />} />

              {/* ===== ADMIN ROUTES ===== */}

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin */}
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

          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
          />
        </CartProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;