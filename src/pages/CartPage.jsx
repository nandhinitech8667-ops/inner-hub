import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { login, logout, token, authAxios } = useUserAuth();
  const { cartItems = [], cartLoading } = useCart();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [logoutMobile, setLogoutMobile] = useState('');

  // 🔥 LOGIN
  const handleLogin = async () => {
    if (!mobile) {
      alert("Enter phone number");
      return;
    }

    try {
      await login({ mobile });

      // ✅ Save mobile for logout verification
      localStorage.setItem("userMobile", mobile);

      setMobile('');
    } catch {
      alert("Login failed");
    }
  };

  // 🔥 CONFIRM LOGOUT
  const handleConfirmLogout = () => {
    if (!logoutMobile) {
      alert("Enter phone number");
      return;
    }

    const savedMobile = localStorage.getItem("userMobile");

    if (logoutMobile !== savedMobile) {
      alert("Wrong phone number ❌");
      return;
    }

    // ✅ Logout
    logout();

    localStorage.removeItem("token");
    localStorage.removeItem("userMobile");
    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutProduct");
    sessionStorage.clear();

    setShowLogoutBox(false);

    // ✅ Redirect to home
    navigate("/");
  };

  // 🔥 PLACE ORDER
  const handlePlaceOrder = async () => {
    try {
      await authAxios.post('/user/orders');
      alert("Order placed successfully ✅");
      window.location.reload();
    } catch {
      alert("Order failed ❌");
    }
  };

  // 🔐 LOGIN SCREEN
  if (!token) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginLeft}>
            <h2>Welcome Back</h2>
            <p>Login to access your cart</p>
          </div>

          <div style={styles.loginRight}>
            <h3>Login</h3>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleLogin} style={styles.button}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔄 LOADING
  if (cartLoading) return <h2>Loading...</h2>;

  // 🛒 CART UI
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Your Cart</h2>
        <button onClick={() => setShowLogoutBox(true)} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* EMPTY */}
      {cartItems.length === 0 ? (
        <div style={styles.empty}>
          <RiShoppingCartLine size={80} />
          <h3>Cart is empty</h3>
        </div>
      ) : (
        <div style={styles.grid}>
          <div>
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div key={item._id} style={styles.item}>
                  <img src={product.images?.[0]} alt="" width="100" />
                  <div>
                    <h4>{product.name}</h4>
                    <p>₹ {product.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.summary}>
            <h3>Summary</h3>
            <p>Total: ₹ {cartItems.reduce((t, i) => t + (i.productId?.price * i.quantity || 0), 0)}</p>

            <button onClick={handlePlaceOrder} style={styles.placeBtn}>
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* 🔥 LOGOUT POPUP */}
      {showLogoutBox && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>Confirm Logout</h3>
            <p>Enter phone number to logout</p>

            <input
              type="tel"
              placeholder="Phone number"
              value={logoutMobile}
              onChange={(e) => setLogoutMobile(e.target.value)}
              style={styles.input}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleConfirmLogout} style={styles.button}>
                Confirm
              </button>

              <button onClick={() => setShowLogoutBox(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 STYLES
const styles = {
  container: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between" },
  logoutBtn: { background: "red", color: "#fff", padding: "8px" },
  grid: { display: "flex", gap: "20px" },
  item: { display: "flex", gap: "10px", padding: "10px", borderBottom: "1px solid #ccc" },
  summary: { border: "1px solid #ccc", padding: "10px" },
  placeBtn: { background: "green", color: "#fff", padding: "10px" },

  loginContainer: {
    height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"
  },
  loginCard: { display: "flex", width: "600px", background: "#fff" },
  loginLeft: { flex: 1, background: "#2874f0", color: "#fff", padding: "30px" },
  loginRight: { flex: 1, padding: "30px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px" },
  button: { background: "#fb641b", color: "#fff", padding: "10px", border: "none" },

  empty: { textAlign: "center", marginTop: "50px" },

  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
  },
  popup: {
    background: "#fff", padding: "20px", borderRadius: "10px", width: "300px", textAlign: "center"
  }
};

export default CartPage;