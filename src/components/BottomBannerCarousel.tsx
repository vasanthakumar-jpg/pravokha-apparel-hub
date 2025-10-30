import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
    description: "Discover the latest trends in fashion",
    image: "/placeholder.svg",
    link: "/products?filter=newArrival",
    buttonText: "Shop New",
  },
  {
    id: 2,
    title: "Limited Time Offer",
    description: "Up to 50% off on selected items",
    image: "/placeholder.svg",
    link: "/products",
    buttonText: "Shop Deals",
  },
  {
    id: 3,
    title: "Premium Quality",
    description: "Experience comfort and style",
    image: "/placeholder.svg",
    link: "/products?filter=featured",
    buttonText: "Explore",
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
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${banner.image})`,
            }}
          >
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

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
