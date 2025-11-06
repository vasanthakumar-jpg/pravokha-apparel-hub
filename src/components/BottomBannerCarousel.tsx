import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import newSeasonImg from "@/assets/category-new-season.jpg";
import saleImg from "@/assets/category-sale.jpg";
import premiumImg from "@/assets/category-premium.jpg";
import LazyImage from "./LazyImage";

interface BannerSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
}

const banners: BannerSlide[] = [
  {
    id: 1,
    title: "New Season Arrivals",
    description: "Discover the latest trends in fashion. Fresh styles for the modern wardrobe.",
    image: newSeasonImg,
    link: "/products",
    buttonText: "Shop New Collection",
  },
  {
    id: 2,
    title: "Limited Time Offer",
    description: "Up to 50% off on selected items. Don't miss out on incredible deals!",
    image: saleImg,
    link: "/products",
    buttonText: "Shop Deals Now",
  },
  {
    id: 3,
    title: "Premium Quality",
    description: "Experience unmatched comfort and timeless style with our premium collection.",
    image: premiumImg,
    link: "/products",
    buttonText: "Explore Premium",
  },
];

export const BottomBannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full relative"
          >
            <LazyImage 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-up">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 animate-fade-up">
                {banner.description}
              </p>
              <Link to={banner.link}>
                <Button size="lg" className="animate-fade-up">
                  {banner.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}


      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 h-3 bg-white dark:bg-white"
                : "w-3 h-3 bg-white/60 dark:bg-white/50 hover:bg-white/80 dark:hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
