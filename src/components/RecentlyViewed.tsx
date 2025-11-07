import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RelatedProducts from "./RelatedProducts";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="space-y-4">
      <RelatedProducts products={recentlyViewed} title="Recently Viewed" />
      <div className="container flex justify-center">
        <Link to="/products">
          <Button variant="outline" size="lg" className="group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
