import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const Banner = () => {
  const banners = [
    {
      id: 1,
      title: "Cups & Saucers",
      price: "From ₹89",
      img: "https://images.unsplash.com/photo-1582582429416-1b4d3b5e9c62"
    },
    {
      id: 2,
      title: "Fashion Sale",
      price: "Up to 70% OFF",
      img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53"
    },
    {
      id: 3,
      title: "Mobiles",
      price: "Best Deals",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
    }
  ];

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }}
      loop={true}
    >
      {banners.map((b) => (
        <SwiperSlide key={b.id}>
          <div className="banner">
            <div className="banner-left">
              <h2>{b.title}</h2>
              <h1>{b.price}</h1>
              <p>Best deals for You!</p>
            </div>
            <img src={b.img} alt="banner" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;