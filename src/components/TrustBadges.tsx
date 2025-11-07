import { Shield, Truck, RefreshCw, CreditCard, Lock } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: Shield, text: "100% Secure Payments", color: "text-success" },
    { icon: Truck, text: "Free Shipping ₹999+", color: "text-primary" },
    { icon: RefreshCw, text: "Easy 7 Day Returns", color: "text-secondary" },
    { icon: CreditCard, text: "COD Available", color: "text-accent-foreground" },
    { icon: Lock, text: "Privacy Protected", color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-t border-b bg-muted/20">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-background/50 transition-colors">
          <badge.icon className={`h-8 w-8 ${badge.color}`} />
          <span className="text-xs font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
