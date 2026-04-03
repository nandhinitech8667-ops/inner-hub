import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiStarFill, RiStarHalfFill, RiShoppingCartLine, RiFlashlightLine, RiTruckLine, RiShieldCheckLine, RiArrowLeftLine, RiAddLine, RiSubtractLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUserAuthenticated } = useUserAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/user/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getRating = (id) => {
    if (!id) return '4.5';
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return (3.5 + (hash % 15) / 10).toFixed(1);
  };

  const getRatingCount = (id) => {
    if (!id) return 100;
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 50 + (hash % 950);
  };

  const renderStars = (r) => {
    const stars = [];
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<RiStarFill key={`f${i}`} />);
    if (half) stars.push(<RiStarHalfFill key="h" />);
    return stars;
  };

  const handleAddToCart = async () => {
    if (!isUserAuthenticated) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
  if (!isUserAuthenticated) {
    navigate(`/login?redirect=/product/${id}`);
    return;
  }

  try {
    await addToCart(product._id, quantity);

    // ✅ SAVE PRODUCT (for safety on refresh)
    const checkoutData = {
      ...product,
      quantity: quantity
    };

    localStorage.setItem("checkoutProduct", JSON.stringify(checkoutData));

    // ✅ PASS PRODUCT TO CHECKOUT
    navigate('/checkout', {
      state: {
        selectedProduct: checkoutData
      }
    });

  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to process');
  }
};

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (product?.images?.length > 1) {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (product?.images?.length > 1) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };


  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const rating = getRating(product._id);
  const ratingCount = getRatingCount(product._id);
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="product-detail-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <RiArrowLeftLine /> Back
      </button>

      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="image-slider-container">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className={`slider-image ${selectedImage === idx ? 'active' : ''}`}
                    />
                  ))}
                </div>
                {product.images.length > 1 && (
                  <>
                    <button className="slider-arrow left" onClick={handlePrevImage}>
                      <RiArrowLeftSLine />
                    </button>
                    <button className="slider-arrow right" onClick={handleNextImage}>
                      <RiArrowRightSLine />
                    </button>
                    <div className="slider-dots">
                      {product.images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`slider-dot ${selectedImage === idx ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(idx);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="gallery-placeholder">📦</div>
            )}
            {product.discount > 0 && (
              <span className="discount-badge large">{product.discount}% OFF</span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`gallery-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-rating">
            <div className="rating-badge">
              <span>{rating}</span>
              <RiStarFill />
            </div>
            <span className="rating-text">{ratingCount} Ratings & Reviews</span>
          </div>

          <div className="product-detail-price">
            <span className="detail-current-price">₹{Math.round(discountedPrice).toLocaleString()}</span>
            {product.discount > 0 && (
              <>
                <span className="detail-original-price">₹{product.price.toLocaleString()}</span>
                <span className="detail-discount-text">{product.discount}% off</span>
              </>
            )}
          </div>

          <div className="product-detail-desc">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="no-stock">✕ Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <span>Quantity:</span>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <RiSubtractLine />
                </button>
                <span className="qty-value">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                  <RiAddLine />
                </button>
              </div>
            </div>
          )}

          <div className="product-detail-actions">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              <RiShoppingCartLine /> {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <RiFlashlightLine /> Buy Now
            </button>
          </div>

          <div className="product-detail-features">
            <div className="detail-feature">
              <RiTruckLine />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹499</span>
              </div>
            </div>
            <div className="detail-feature">
              <RiShieldCheckLine />
              <div>
                <strong>Secure Payment</strong>
                <span>100% secure transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
