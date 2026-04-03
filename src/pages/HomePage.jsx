import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiSearchLine } from 'react-icons/ri';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import ProductCard from '../components/ProductCard';
import './HomePage.css';

const API_URL = 'http://localhost:5000/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const productsRef = useRef(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // FETCH CATEGORY
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/products/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get(`${API_URL}/user/products`, { params });
      setProducts(res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SHOP NOW FUNCTION
  // const handleShopNow = () => {
  //   setSelectedCategory('');
  //   productsRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // FILTER
  const boysShortsProducts = products.filter(
    (p) => p.category === "Boys Shorts"
  );

  const sliderProducts =
    boysShortsProducts.length > 0
      ? [...boysShortsProducts, ...boysShortsProducts, ...boysShortsProducts]
      : [];

  // BANNERS
  const banners = [
    {
      id: 1,
      title: "Boys Shorts",
      price: "From ₹199",
      desc: "Comfort & Style",
      img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
    },
    {
      id: 2,
      title: "Casual Shorts",
      price: "Up to 50% OFF",
      desc: "Daily Wear",
      img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
    },
    {
      id: 3,
      title: "Denim Shorts",
      price: "Trending Now",
      desc: "Stylish Look",
      img: "https://images.unsplash.com/photo-1523381294911-8d3cead13475"
    }
  ];

  return (
    <div className="home-page">

      {/* ✅ PREMIUM HERO */}
      {!searchQuery && (
        <div className="premium-hero">
          <span className="badge">Premium Men's Essentials</span>

          <h1>
            Style That Speaks <br />
            <span>Confidence.</span>
          </h1>

          <p>
            Discover thoughtfully crafted essentials designed for everyday
            comfort and elevated modern living.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/shop')}>
              Shop Now
            </button>
            <button className="btn-outline">Explore</button>
          </div>
        </div>
      )}

      {/* 🔥 BANNER */}
      {!searchQuery && (
        <div className="banner-container">
          <Swiper modules={[Autoplay]} autoplay={{ delay: 3000 }} loop>
            {banners.map((b) => (
              <SwiperSlide key={b.id}>
                <div className="banner">
                  <div className="banner-left">
                    <h2>{b.title}</h2>
                    <h1>{b.price}</h1>
                    <p>{b.desc}</p>
                    <button className="shop-btn" onClick={() => navigate('/shop')}>
                      Shop Now
                    </button>
                  </div>
                  <img src={b.img} alt={b.title} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* FEATURES */}
      <section className="features-bar">
        <div>🚚 Free Delivery</div>
        <div>🔒 Secure Payment</div>
        <div>💬 24/7 Support</div>
      </section>

      {/* CATEGORY */}
      {categories.length > 0 && (
        <section className="category-section">
          <div className="category-pills">

            <button
              className={`category-pill ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}

          </div>
        </section>
      )}

      {/* SEARCH */}
      {searchQuery && (
        <div className="search-header">
          <h2><RiSearchLine /> "{searchQuery}"</h2>
        </div>
      )}

      {/* SLIDER */}
      {!searchQuery && sliderProducts.length > 0 && (
        <div className="product-slider-container">
          <div className="product-slider">

            <h2>Boys Shorts</h2>

            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              autoplay={{ delay: 2000 }}
              loop
            >
              {sliderProducts.slice(0, 6).map((product, index) => (
                <SwiperSlide key={index}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <section className="products-section" ref={productsRef}>
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <>
              <div className="products-grid">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* ✅ VIEW ALL BUTTON */}
              {products.length > 4 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/shop')}
                  >
                    View All Products
                  </button>
                </div>
              )}
            </>
          )}
      </section>

    </div>
  );
};

export default HomePage;