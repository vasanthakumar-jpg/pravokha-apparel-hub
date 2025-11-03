import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Heart, Menu, LogOut, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/products";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
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
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">PRAVOKHA</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2">
                  <Link to="/" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                  </Link>
                  {categories.map((category) => (
                    <Link key={category.id} to={`/products?category=${category.slug}`} onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">{category.name}</Button>
                    </Link>
                  ))}
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
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent whitespace-nowrap">
                PRAVOKHA
              </h1>
            </Link>
          </div>

          {/* Right: Search, Favourite, Cart, Theme, Login/Logout */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 bg-background border rounded-lg px-3 py-2 shadow-lg animate-scale-in w-[200px] md:w-[280px] z-50">
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search..."
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
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
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