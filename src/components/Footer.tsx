import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useTheme } from "next-themes";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import TrustBadges from "./TrustBadges";
import PaymentIcons from "./PaymentIcons";

const emailSchema = z.string().email("Invalid email address");

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscribed successfully!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container">
        <TrustBadges />
      </div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src={theme === 'dark' ? logoDark : logoLight} 
              alt="PRAVOKHA" 
              className="h-12 w-auto object-contain"
            />
            <p className="text-sm text-muted-foreground">
              Premium fashion for the modern lifestyle. Quality fabrics, trendy designs, and unbeatable comfort.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                <a href="https://www.instagram.com/vasanth_vasu_vv/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=t-shirts" className="text-muted-foreground hover:text-primary transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=track-pants" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Pants
                </Link>
              </li>
              <li>
                <Link to="/products?category=shorts" className="text-muted-foreground hover:text-primary transition-colors">
                  Shorts
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers and updates
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary-hover"
                disabled={isSubmitting}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-4">
              <PaymentIcons />
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Pravokha. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
