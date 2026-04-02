import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const [searchParams] = useSearchParams();
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

  // 🔥 FILTER
  const boysShortsProducts = products.filter(
    (p) => p.category === "Boys Shorts"
  );

  // 🔥 FIX: DUPLICATE PRODUCTS (SHOW 4-5 CARDS)
  const sliderProducts =
    boysShortsProducts.length > 0
      ? [...boysShortsProducts, ...boysShortsProducts, ...boysShortsProducts]
      : [];

  // 🔥 BANNER DATA (FIXED)
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
  },
  {
    id: 4,
    title: "Cotton Shorts",
    price: "Best Comfort",
    desc: "Soft Fabric",
    img: "https://www.google.com/imgres?q=boys%20shots%20image&imgurl=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81ryKeiAhQL._AC_SR175%2C263_QL70_.jpg&imgrefurl=https%3A%2F%2Fwww.amazon.in%2Fshots-for-boys%2Fs%3Fk%3Dshots%2Bfor%2Bboys&docid=MiJ8rsGCJsaoyM&tbnid=UwCNIom-_zippM&vet=12ahUKEwi96JO8is-TAxUXV3ADHRjSH-0QnPAOegQIFhAA..i&w=175&h=263&hcb=2&ved=2ahUKEwi96JO8is-TAxUXV3ADHRjSH-0QnPAOegQIFhAA"
  },
  {
    id: 5,
    title: "Sports Shorts",
    price: "From ₹299",
    desc: "Active Wear",
    img: "data:image/jpeg;base64,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"
  }
]; 

  return (
    <div className="home-page">

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
                    <button className="shop-btn">Shop Now</button>
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

      {/* 🔥 SLIDER (NOW SHOWS MULTIPLE CARDS) */}
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

      {/* PRODUCTS GRID */}
      <section className="products-section">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;