import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, variantId: string, size: string) => void;
  updateQuantity: (productId: string, variantId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("pravokha-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("pravokha-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId && i.size === item.size
      );
      
      if (existing) {
        toast({
          title: "Updated cart",
          description: `${item.title} quantity updated`,
        });
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      toast({
        title: "Added to cart",
        description: `${item.title} (${item.colorName}, ${item.size}) added to cart`,
      });
      
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string, size: string) => {
    setItems((prev) => prev.filter(
      (i) => !(i.productId === productId && i.variantId === variantId && i.size === size)
    ));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const updateQuantity = (productId: string, variantId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items removed from cart",
    });
  };

  // Check for T-shirt combo: 3 items at Rs 325 each = Rs 949 total
  const tshirtItems = items.filter(item => item.price === 325);
  const tshirtCount = tshirtItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasComboOffer = tshirtCount === 3;
  
  const cartTotal = hasComboOffer 
    ? 949 + items.filter(item => item.price !== 325).reduce((sum, item) => sum + item.price * item.quantity, 0)
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
