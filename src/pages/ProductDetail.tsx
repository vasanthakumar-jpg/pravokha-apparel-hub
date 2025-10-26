import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Star, Truck, RefreshCw, Shield, Heart, Minus, Plus, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [mainImage, setMainImage] = useState(0);

  if (!product || !selectedVariant) {
    return <Navigate to="/products" replace />;
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    if (quantity === 0) {
      toast({
        title: "Please select quantity",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        colorName: selectedVariant.colorName,
        colorHex: selectedVariant.colorHex,
        size: selectedSize,
        price: product.discountPrice || product.price,
        image: selectedVariant.images[mainImage],
      });
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    handleAddToCart();
    navigate("/checkout");
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted animate-fade-in">
              <img
                src={selectedVariant.images[mainImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {selectedVariant.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    mainImage === idx ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={image} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 animate-fade-up">
            <div>
              {product.newArrival && (
                <Badge className="mb-2 bg-secondary text-secondary-foreground">New Arrival</Badge>
              )}
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-muted-foreground mt-1">SKU: {product.sku}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">₹{product.discountPrice || product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">₹{product.price}</span>
                  <Badge className="bg-accent text-accent-foreground">{discountPercent}% OFF</Badge>
                </>
              )}
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Color: {selectedVariant.colorName}
              </Label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setMainImage(0);
                      setSelectedSize("");
                    }}
                    className={`h-12 w-12 rounded-full border-2 transition-all ${
                      selectedVariant.id === variant.id
                        ? "border-primary scale-110 shadow-md"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.colorName}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold">Size</Label>
                <Link to="/size-guide">
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Size Guide
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {selectedVariant.sizes.map((sizeOption) => (
                  <Button
                    key={sizeOption.size}
                    variant={selectedSize === sizeOption.size ? "default" : "outline"}
                    disabled={sizeOption.stock === 0}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    className={selectedSize === sizeOption.size ? "bg-primary" : ""}
                  >
                    {sizeOption.size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Quantity</Label>
              <div className="flex items-center border rounded-md w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-hover"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Premium quality fabric for maximum comfort</li>
              <li>Breathable and moisture-wicking properties</li>
              <li>Perfect fit with excellent durability</li>
              <li>Easy care - machine washable</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">Customer reviews will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Information</h3>
              <p className="text-muted-foreground">
                Free standard shipping on orders above ₹999. Express shipping available at checkout.
                Delivery time: 3-5 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Return Policy</h3>
              <p className="text-muted-foreground">
                30-day return policy. Items must be unworn and in original packaging with tags attached.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
