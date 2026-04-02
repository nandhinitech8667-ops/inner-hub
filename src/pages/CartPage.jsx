import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBinLine, RiAddLine, RiSubtractLine, RiShoppingCartLine, RiArrowLeftLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartLoading, updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

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

  if (cartLoading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <div className="cart-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <RiArrowLeftLine /> Back
        </button>
        <h1><RiShoppingCartLine /> Shopping Cart</h1>
        <span className="cart-count-text">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => {
              if (!item.productId) return null;
              const product = item.productId;
              const discountedPrice = getDiscountedPrice(product);

              return (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item-image" onClick={() => navigate(`/product/${product._id}`)}>
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="cart-item-placeholder">📦</div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3 onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
                    <span className="cart-item-category">{product.category}</span>

                    <div className="cart-item-price">
                      <span className="cart-current-price">₹{Math.round(discountedPrice).toLocaleString()}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="cart-original-price">₹{product.price.toLocaleString()}</span>
                          <span className="cart-discount-badge">{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RiSubtractLine />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= product.stock}
                        >
                          <RiAddLine />
                        </button>
                      </div>

                      <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                        <RiDeleteBinLine /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-card">
              <h3>Price Details</h3>
              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{Math.round(subtotal).toLocaleString()}</span>
              </div>

              <div className="summary-row discount-row">
                <span>Discount</span>
                <span className="discount-text">− ₹{Math.round(totalDiscount).toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-text">{total >= 499 ? 'FREE' : '₹49'}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <strong>Total Amount</strong>
                <strong>₹{Math.round(total < 499 ? total + 49 : total).toLocaleString()}</strong>
              </div>

              {totalDiscount > 0 && (
                <div className="savings-text">
                  You save ₹{Math.round(totalDiscount).toLocaleString()} on this order!
                </div>
              )}

              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
