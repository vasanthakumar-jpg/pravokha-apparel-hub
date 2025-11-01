import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeroCarousel from "@/components/HeroCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { BottomBannerCarousel } from "@/components/BottomBannerCarousel";
import { ArrowRight, TrendingUp, Zap, Shield } from "lucide-react";
import { useGsapAnimations } from "@/hooks/useGsapAnimations";
import menImg from "@/assets/hero-1.jpg";
import womenImg from "@/assets/hero-2.jpg";
import kidsImg from "@/assets/hero-3.jpg";
import premiumImg from "@/assets/category-premium.jpg";
import saleImg from "@/assets/category-sale.jpg";
import newSeasonImg from "@/assets/category-new-season.jpg";

export default function Index() {
  useGsapAnimations();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroCarousel />

      {/* Shop by Category - 3 Cards in Row */}
      <section className="container py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gsap-fade-in">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <CategoryCard
            title="Men"
            description="Explore our premium men's collection"
            image={menImg}
            link="/products?category=t-shirts"
          />
          <CategoryCard
            title="Women"
            description="Discover elegant women's fashion"
            image={womenImg}
            link="/products?category=t-shirts"
          />
          <CategoryCard
            title="Kids"
            description="Fun and comfortable kids' wear"
            image={kidsImg}
            link="/products?category=t-shirts"
          />
        </div>
      </section>

      {/* Featured Collections - 3 Cards */}
      <section className="container py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gsap-fade-in">Featured Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <CategoryCard
            title="Premium Quality"
            description="Experience luxury and comfort"
            image={premiumImg}
            link="/products"
          />
          <CategoryCard
            title="Limited Time Offer"
            description="Up to 50% off selected items"
            image={saleImg}
            link="/products"
          />
          <CategoryCard
            title="New Season Arrivals"
            description="Fresh styles for the season"
            image={newSeasonImg}
            link="/products"
          />
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 gsap-scale-in group">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
            <p className="text-muted-foreground">Stay ahead with our curated collection of the season's hottest styles</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 gsap-scale-in group">
            <Zap className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">Lightning-fast shipping to get your order to you in record time</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 gsap-scale-in group">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-muted-foreground">Premium quality guaranteed on every product with our satisfaction promise</p>
          </Card>
        </div>
      </section>

      {/* Bottom Banner Carousel */}
      <section className="container py-8">
        <div className="gsap-fade-in">
          <BottomBannerCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 gsap-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Ready to Upgrade Your Wardrobe?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Join thousands of satisfied customers worldwide and discover your perfect style today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/products">
              <Button size="lg" className="group hover:scale-105 transition-transform">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/learn-more">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
