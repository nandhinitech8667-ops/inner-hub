import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMapPinLine, RiCheckboxCircleLine, RiArrowLeftLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearLocalCart } = useCart();
  const { authAxios } = useUserAuth();
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const getDiscountedPrice = (product) => {
    if (!product) return 0;
    return product.discount
      ? product.price - (product.price * product.discount / 100)
      : product.price;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    if (!item.productId) return acc;
    return acc + item.productId.price * item.quantity;
  }, 0);

  const totalDiscount = cartItems.reduce((acc, item) => {
    if (!item.productId || !item.productId.discount) return acc;
    return acc + (item.productId.price * item.productId.discount / 100) * item.quantity;
  }, 0);

  const total = subtotal - totalDiscount;
  const deliveryCharge = total >= 499 ? 0 : 49;
  const finalTotal = total + deliveryCharge;

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    try {
      setPlacing(true);
      const res = await authAxios.post('/user/orders', {
        shippingAddress: address
      });
      setOrderPlaced(true);
      setOrderId(res.data.order._id);
      clearLocalCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success-page animate-fade-in">
        <div className="order-success-card">
          <div className="success-icon">
            <RiCheckboxCircleLine />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been placed and will be delivered soon.</p>
          <div className="order-id-display">
            Order ID: <strong>{orderId.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              View My Orders
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate('/cart')}>
        <RiArrowLeftLine /> Back to Cart
      </button>

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2><RiMapPinLine /> Shipping Address</h2>
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="checkout-form-grid">
                <div className="checkout-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="checkout-input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-input-group full">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="123, Main Street, Apartment"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="checkout-form-grid three-col">
                <div className="checkout-input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Chennai"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="checkout-input-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Tamil Nadu"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="checkout-input-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="600001"
                    value={address.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={placing}
              >
                {placing ? 'Placing Order...' : `Place Order — ₹${Math.round(finalTotal).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>

        <div className="checkout-summary-section">
          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-divider"></div>

            {cartItems.map((item) => {
              if (!item.productId) return null;
              const product = item.productId;
              const dp = getDiscountedPrice(product);
              return (
                <div key={item._id} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{product.name}</span>
                    <span className="checkout-item-qty">× {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">₹{Math.round(dp * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{Math.round(subtotal).toLocaleString()}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
                <span className="discount-text">− ₹{Math.round(totalDiscount).toLocaleString()}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-text">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>₹{Math.round(finalTotal).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
