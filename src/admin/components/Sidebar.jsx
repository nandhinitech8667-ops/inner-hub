import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiShoppingBag3Line,
  RiAddBoxLine,
  RiFileList3Line,
  RiLogoutBoxRLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/admin');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">IH</div>
          <div className="sidebar-logo-text">
            <h2>Inner Hub</h2>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <RiDashboardLine />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <RiShoppingBag3Line />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/products/add"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <RiAddBoxLine />
          <span>Add Product</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <RiFileList3Line />
          <span>Orders</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <RiLogoutBoxRLine />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
