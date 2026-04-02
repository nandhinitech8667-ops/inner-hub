import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductSlider = () => {
  const products = [
    { id: 1, name: "Cup", price: 89, img: "https://via.placeholder.com/150" },
    { id: 2, name: "Shoes", price: 999, img: "https://via.placeholder.com/150" },
    { id: 3, name: "Watch", price: 1999, img: "https://via.placeholder.com/150" },
    { id: 4, name: "Phone", price: 14999, img: "https://via.placeholder.com/150" },
    { id: 5, name: "Bag", price: 799, img: "https://via.placeholder.com/150" }
  ];

  return (
    <div className="product-section">
      <h2>Top Deals</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        autoplay={{ delay: 2000 }}
        loop={true}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="card">
              <img src={p.img} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;