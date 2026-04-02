import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-main-content">
        <Outlet />
      </main>
      <footer className="user-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <div className="navbar-logo-icon" style={{ width: '36px', height: '36px', fontSize: '14px' }}>IH</div>
                <span>Inner Hub</span>
              </div>
              <p className="footer-desc">Your one-stop destination for quality products at unbeatable prices.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="/">Home</a>
              <a href="/cart">My Cart</a>
              <a href="/orders">My Orders</a>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <a href="#">FAQs</a>
              <a href="#">Shipping Policy</a>
              <a href="#">Return Policy</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p>support@innerhub.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Inner Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
