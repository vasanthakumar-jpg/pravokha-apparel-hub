import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 5000]);
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (categoryParam && categoryParam !== "all") {
      setSelectedCategories([categoryParam]);
      setTempCategories([categoryParam]);
    }
  }, [categoryParam]);

  let filteredProducts = [...products];

  // Filter by category
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }

  // Filter by price
  filteredProducts = filteredProducts.filter(
    (p) => (p.discountPrice || p.price) >= priceRange[0] && (p.discountPrice || p.price) <= priceRange[1]
  );

  // Sort
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const toggleTempCategory = (categoryId: string) => {
    setTempCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const applyFilters = () => {
    setSelectedCategories(tempCategories);
    setPriceRange(tempPriceRange);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setTempCategories([]);
    setPriceRange([0, 5000]);
    setTempPriceRange([0, 5000]);
  };

  const FilterContent = ({ isDesktop = false }: { isDesktop?: boolean }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-base">Categories</h3>
        <div className="space-y-3">
          {categories.filter(c => c.id !== "all").map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${isDesktop ? 'desktop-' : 'mobile-'}${category.id}`}
                checked={isDesktop ? selectedCategories.includes(category.id) : tempCategories.includes(category.id)}
                onCheckedChange={() => isDesktop ? setSelectedCategories(prev => 
                  prev.includes(category.id) ? prev.filter(c => c !== category.id) : [...prev, category.id]
                ) : toggleTempCategory(category.id)}
              />
              <Label 
                htmlFor={`${isDesktop ? 'desktop-' : 'mobile-'}${category.id}`} 
                className="text-sm cursor-pointer font-medium"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-base">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={isDesktop ? priceRange : tempPriceRange}
            onValueChange={isDesktop ? setPriceRange : setTempPriceRange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm font-medium">
            <span>₹{isDesktop ? priceRange[0] : tempPriceRange[0]}</span>
            <span>₹{isDesktop ? priceRange[1] : tempPriceRange[1]}</span>
          </div>
        </div>
      </div>

      {!isDesktop && (
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1 bg-primary hover:bg-primary-hover">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent isDesktop={false} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6 p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Clear
                </Button>
              </div>
              <FilterContent isDesktop={true} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 2000]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
