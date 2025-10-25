import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
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
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 animate-fade-in">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
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

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full bg-primary hover:bg-primary-hover"
              size="sm"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>

          {/* Color Variants Preview */}
          <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.variants.slice(0, 4).map((variant) => (
              <div
                key={variant.id}
                className="h-6 w-6 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: variant.colorHex }}
                title={variant.colorName}
              />
            ))}
            {product.variants.length > 4 && (
              <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                +{product.variants.length - 4}
              </div>
            )}
          </div>
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
