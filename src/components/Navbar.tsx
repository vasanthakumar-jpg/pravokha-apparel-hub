import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Heart, Menu, LogOut, User, X } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { categories, products } from "@/data/products";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { debounce } from "@/utils/debounce";
import LazyImage from "./LazyImage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        const filtered = products.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const toggleSearch = () => {
    const newState = !searchOpen;
    setSearchOpen(newState);
    if (newState) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-0">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 flex flex-col">
                <SheetHeader>
                  <SheetTitle className="text-left">PRAVOKHA</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 -mx-6 px-6">
                  <nav className="mt-6 flex flex-col gap-2 pb-4">
                    <Link to="/" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">Home</Button>
                    </Link>
                    {categories.map((category) => (
                      <Link key={category.id} to={`/products?category=${category.slug}`} onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start">{category.name}</Button>
                      </Link>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start opacity-50 cursor-not-allowed"
                      disabled
                      title="Coming Soon"
                    >
                      Women
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start opacity-50 cursor-not-allowed"
                      disabled
                      title="Coming Soon"
                    >
                      Kids
                    </Button>
                    <Link to="/support" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">Support</Button>
                    </Link>
                    <Link to="/contact" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">Contact</Button>
                    </Link>
                    {user && (
                      <Link to="/orders" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start">My Orders</Button>
                      </Link>
                    )}
                    {user ? (
                      <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                        <LogOut className="h-4 w-4 mr-2" />Logout
                      </Button>
                    ) : (
                      <Link to="/auth" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />Login
                        </Button>
                      </Link>
                    )}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center -ml-1">
              <img 
                src={theme === "dark" ? logoDark : logoLight} 
                alt="PRAVOKHA Logo" 
                className="h-10 w-[160px] md:h-12 md:w-[250px] object-contain" 
                loading="eager" 
              />
            </Link>
          </div>

          {/* Desktop Menu - Above 1024px */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" size="sm">All Products</Button>
            </Link>
            <Link to="/products?category=t-shirts">
              <Button variant="ghost" size="sm">T-shirts</Button>
            </Link>
            <Link to="/products?category=track-pants">
              <Button variant="ghost" size="sm">Track Pants</Button>
            </Link>
            <Link to="/products?category=shorts">
              <Button variant="ghost" size="sm">Shorts</Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled 
              className="opacity-50 cursor-not-allowed"
              title="Coming Soon"
            >
              Women
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled 
              className="opacity-50 cursor-not-allowed"
              title="Coming Soon"
            >
              Kids
            </Button>
            <Link to="/support">
              <Button variant="ghost" size="sm">Support</Button>
            </Link>
            {user && (
              <Link to="/orders">
                <Button variant="ghost" size="sm">My Orders</Button>
              </Link>
            )}
          </nav>

          {/* Right: Search, Favourite, Cart, Theme, Login/Logout */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
                  <form onSubmit={handleSearch} className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2 shadow-lg animate-scale-in w-[250px] md:w-[320px]">
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 p-0 h-6 focus-visible:ring-0 text-sm"
                    />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSearch}>
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg overflow-hidden animate-scale-in">
                      <ScrollArea className="max-h-[400px]">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                          >
                            <LazyImage
                              src={product.variants[0].images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.title}</p>
                              <p className="text-xs text-muted-foreground">₹{product.discountPrice || product.price}</p>
                            </div>
                          </button>
                        ))}
                      </ScrollArea>
                      <button
                        onClick={() => handleSearch()}
                        className="w-full p-2 text-sm text-center text-primary hover:bg-muted border-t"
                      >
                        View all results
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Favourite */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login/Logout */}
            {user ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden lg:flex" title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/auth" className="hidden lg:inline-flex">
                <Button variant="ghost" size="icon" title="Login">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}