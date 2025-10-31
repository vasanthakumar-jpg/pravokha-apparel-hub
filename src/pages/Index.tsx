import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { BottomBannerCarousel } from "@/components/BottomBannerCarousel";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react";

export default function Index() {
  const featuredProducts = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.newArrival);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroCarousel />

      {/* Features */}
      <section className="py-8 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% protected payments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-1">Fresh styles just landed</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Best Sellers</h2>
              <p className="text-muted-foreground mt-1">Most loved by our customers</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CategoryCard 
              title="Men"
              description="T-shirts, Track Pants & Shorts"
              image="/placeholder.svg"
              link="/products?category=men"
            />
            <CategoryCard 
              title="Women"
              description="T-shirts, Track Pants & Shorts"
              image="/placeholder.svg"
              link="/products?category=women"
            />
            <CategoryCard 
              title="Kids"
              description="T-shirts, Track Pants & Shorts"
              image="/placeholder.svg"
              link="/products?category=kids"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 text-background">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Pravokha Community
              </h2>
              <p className="text-lg mb-6 text-background/90">
                Get exclusive access to new collections, special offers, and style tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/learn-more">
                  <Button size="lg" variant="outline" className="border-background bg-background/10 text-background hover:bg-background/20">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner Carousel */}
      <section className="py-0">
        <BottomBannerCarousel />
      </section>
    </div>
  );
}
