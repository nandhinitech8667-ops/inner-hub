import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiSearchLine, RiShoppingCartLine, RiUserLine, RiLogoutBoxRLine, RiFileListLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import { RiShoppingBagLine } from "react-icons/ri";

const Navbar = () => {
  const { user, isUserAuthenticated, logout } = useUserAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">IH</div>
          <span className="navbar-logo-text">Inner Hub</span>
        </Link>

        <form className={`navbar-search ${mobileMenu ? 'mobile-show' : ''}`} onSubmit={handleSearch}>
          <RiSearchLine className="search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="navbar-search-input"
          />
        </form>

        <div className="navbar-actions">
          <Link to="/shop" className="navbar-cart-btn" id="cart-btn"><RiShoppingBagLine size={20} /> Product</Link>
          <Link to="/cart" className="navbar-cart-btn" id="cart-btn">
            <RiShoppingCartLine />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            <span className="cart-text">Cart</span>
          </Link>

          {isUserAuthenticated ? (
            <div className="navbar-user-menu" ref={dropdownRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                id="user-menu-btn"
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div className="user-dropdown animate-fade-in">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email || user?.mobile}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <RiFileListLine /> My Orders
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <RiLogoutBoxRLine /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn" id="login-btn">
              <RiUserLine />
              <span>Login</span>
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <RiCloseLine /> : <RiMenuLine />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  