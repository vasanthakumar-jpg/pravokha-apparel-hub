import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LazyImage from "./LazyImage";

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
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:border-primary hover:shadow-lg transition-all duration-300 animate-fade-in">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <LazyImage
            src={firstVariant.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-accent text-accent-foreground">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.newArrival && (
              <Badge className="bg-secondary text-secondary-foreground">
                New
              </Badge>
            )}
          </div>

          {/* Favorite Icon - Always Visible */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
          >
            <Heart className={`h-5 w-5 transition-colors ${isInWishlist ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'}`} />
          </button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mt-1 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{product.discountPrice || product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
