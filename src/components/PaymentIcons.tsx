import { CreditCard } from "lucide-react";

export default function PaymentIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs text-muted-foreground font-medium">We Accept:</span>
      <div className="flex flex-wrap items-center gap-2">
        {/* UPI */}
        <div className="h-8 px-3 bg-background border rounded flex items-center justify-center text-xs font-semibold">
          UPI
        </div>
        {/* Visa */}
        <div className="h-8 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white border rounded flex items-center justify-center text-xs font-bold">
          VISA
        </div>
        {/* Mastercard */}
        <div className="h-8 px-3 bg-gradient-to-r from-red-600 to-orange-500 text-white border rounded flex items-center justify-center text-xs font-bold">
          MC
        </div>
        {/* Rupay */}
        <div className="h-8 px-3 bg-gradient-to-r from-green-600 to-blue-600 text-white border rounded flex items-center justify-center text-xs font-bold">
          RuPay
        </div>
        {/* Paytm */}
        <div className="h-8 px-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white border rounded flex items-center justify-center text-xs font-bold">
          Paytm
        </div>
        {/* COD */}
        <div className="h-8 px-3 bg-background border rounded flex items-center gap-1 text-xs font-semibold">
          <CreditCard className="h-3 w-3" />
          COD
        </div>
      </div>
    </div>
  );
}
