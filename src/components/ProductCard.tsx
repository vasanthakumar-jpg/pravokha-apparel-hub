import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LazyImage from "./LazyImage";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkWishlistStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkWishlistStatus();
    });

    return () => subscription.unsubscribe();
  }, [product.id]);

  const checkWishlistStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsInWishlist(false);
      return;
    }

    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    setIsInWishlist(!!data);
  };
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isInWishlist) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (!error) {
        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${product.title} removed from your wishlist`,
        });
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: product.id }]);

      if (!error) {
        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: `${product.title} added to your wishlist`,
        });
      }
    }
  };

  const firstVariant = product.variants[0];
  const [selectedVariant] = useState(firstVariant);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstAvailableSize = firstVariant.sizes.find((s) => s.stock > 0);
    if (firstAvailableSize) {
      addToCart({
        productId: product.id,
        variantId: firstVariant.id,
        title: product.title,
        colorName: firstVariant.colorName,
        colorHex: firstVariant.colorHex,
        size: firstAvailableSize.size,
        price: product.discountPrice || product.price,
        image: firstVariant.images[0],
      });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
    }
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-fade-in">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <LazyImage
            src={selectedVariant.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground shadow-md">
              Featured
            </Badge>
          )}
          {product.newArrival && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground shadow-md">
              New
            </Badge>
          )}
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="bg-background text-foreground hover:bg-background/90 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3 transition-colors duration-200",
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              ₹{product.discountPrice || product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="p-2 rounded-full hover:bg-muted transition-all duration-200 group-hover:scale-110"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isInWishlist 
                  ? "fill-red-500 text-red-500" 
                  : "text-muted-foreground hover:text-red-500"
              )} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}
