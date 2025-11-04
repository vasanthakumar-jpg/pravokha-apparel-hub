import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Mail } from "lucide-react";

export const ComboOfferBanner = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20">
      <div className="p-8 md:p-12 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Combo Offer! 🎉
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            Buy Any 3 Items Just ₹949
          </p>
          <p className="text-muted-foreground">
            Mix and match T-shirts, Track Pants, and Shorts
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/products?category=t-shirts">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shop T-shirts
            </Button>
          </Link>
          <Link to="/products?category=track-pants">
            <Button size="lg" variant="secondary" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shop Track Pants
            </Button>
          </Link>
          <Link to="/products?category=shorts">
            <Button size="lg" variant="outline" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shop Shorts
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="gap-2">
              <Mail className="h-5 w-5" />
              Bulk Orders
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          *Valid on all colors and sizes | Limited time offer
        </p>
      </div>
    </Card>
  );
};
