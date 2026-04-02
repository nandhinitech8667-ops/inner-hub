import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiStarFill, RiStarHalfFill, RiShoppingCartLine } from 'react-icons/ri';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useUserAuth();
  const { addToCart } = useCart();

  // Generate consistent pseudo-random rating from product id
  const getRating = (id) => {
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return (3.5 + (hash % 15) / 10).toFixed(1);
  };

  const getRatingCount = (id) => {
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 50 + (hash % 950);
  };

  const rating = getRating(product._id);
  const ratingCount = getRatingCount(product._id);
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const renderStars = (r) => {
    const stars = [];
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    for (let i = 0; i < full; i++) {
      stars.push(<RiStarFill key={`f${i}`} />);
    }
    if (half) stars.push(<RiStarHalfFill key="h" />);
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isUserAuthenticated) {
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }
    try {
      await addToCart(product._id);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card animate-fade-in" onClick={handleClick} id={`product-${product._id}`}>
      <div className="product-card-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">
            <span>📦</span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-rating">
          <div className="stars">{renderStars(parseFloat(rating))}</div>
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({ratingCount})</span>
        </div>

        <div className="product-card-price">
          <span className="current-price">₹{Math.round(discountedPrice).toLocaleString()}</span>
          {product.discount > 0 && (
            <span className="original-price">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <RiShoppingCartLine /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
