import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Link } from "react-router-dom";

const slides = [
  {
    image: hero1,
    title: "Premium Quality Tees",
    description: "Discover comfort & style in every thread",
    cta: "Shop T-Shirts",
    link: "/products?category=t-shirts",
  },
  {
    image: hero2,
    title: "Athletic Track Pants",
    description: "Performance meets fashion",
    cta: "Shop Track Pants",
    link: "/products?category=track-pants",
  },
  {
    image: hero3,
    title: "Summer Collection",
    description: "Fresh styles for the season",
    cta: "Shop Shorts",
    link: "/products?category=shorts",
  },
  {
    image: hero1,
    title: "Bulk Orders Available",
    description: "Special pricing for bulk purchases. Contact us for wholesale rates.",
    cta: "Contact for Bulk Orders",
    link: "/contact",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-muted">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-2xl space-y-4 text-background animate-fade-up">
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-background/90">
                  {slide.description}
                </p>
                <Link to={slide.link}>
                  <Button 
                    size="lg" 
                    className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-background"
                : "w-2 bg-background/50 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
