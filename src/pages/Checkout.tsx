import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentMethods } from "@/components/PaymentMethods";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Phone must be a valid 10-digit Indian number"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500, "Address must be less than 500 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(100, "City must be less than 100 characters"),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Pincode must be a valid 6-digit Indian pincode"),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with checkout",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUser(user);
    setLoading(false);
  };

  const shipping = 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation with zod
    try {
      checkoutSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form",
          variant: "destructive",
        });
        return;
      }
    }

    // Simulate payment processing
    toast({
      title: "Order placed successfully! 🎉",
      description: `Your order of ₹${total} has been confirmed. Order ID: #${Date.now().toString().slice(-8)}`,
    });

    clearCart();
    setTimeout(() => navigate("/"), 2000);
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={cn(errors.name && "border-red-500")}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className={cn(errors.phone && "border-red-500")}
                    required
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={cn(errors.email && "border-red-500")}
                  required
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className={cn(errors.address && "border-red-500")}
                  required
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={cn(errors.city && "border-red-500")}
                    required
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className={cn(errors.pincode && "border-red-500")}
                    required
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} />
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.colorName} • {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18%)</span>
                  <span>₹{tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-lg h-12" 
                onClick={handleSubmit}
              >
                Place Order
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
