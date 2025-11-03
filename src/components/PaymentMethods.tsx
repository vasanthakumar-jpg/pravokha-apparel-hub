import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smartphone, CreditCard, Building2, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import paymentQR from "@/assets/payment-qr.png";

interface PaymentMethodsProps {
  value: string;
  onChange: (value: string) => void;
}

export const PaymentMethods = ({ value, onChange }: PaymentMethodsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {/* UPI Payment */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all group">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
              <Smartphone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <span className="font-medium">UPI Payment</span>
                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
              <Badge variant="secondary" className="text-xs">Recommended</Badge>
            </Label>
          </div>

          {/* QR Code */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all group">
            <RadioGroupItem value="qr" id="qr" />
            <Label htmlFor="qr" className="flex items-center gap-3 cursor-pointer flex-1">
              <QrCode className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <span className="font-medium">Scan QR Code</span>
                <p className="text-xs text-muted-foreground">Pay using any UPI app</p>
              </div>
            </Label>
          </div>

          {/* Credit/Debit Card */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60 cursor-not-allowed">
            <RadioGroupItem value="card" id="card" disabled />
            <Label htmlFor="card" className="flex items-center gap-3 flex-1">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium">Credit/Debit Card</span>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Rupay</p>
              </div>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </Label>
          </div>

          {/* Net Banking */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60 cursor-not-allowed">
            <RadioGroupItem value="netbanking" id="netbanking" disabled />
            <Label htmlFor="netbanking" className="flex items-center gap-3 flex-1">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium">Net Banking</span>
                <p className="text-xs text-muted-foreground">All major banks supported</p>
              </div>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </Label>
          </div>
        </RadioGroup>

        {/* Payment Info and QR Code */}
        {value === "qr" && (
          <div className="mt-6 p-6 bg-muted/50 rounded-lg space-y-4">
            <h4 className="font-semibold text-center">Scan QR Code to Pay</h4>
            <div className="flex justify-center">
              <img 
                src={paymentQR} 
                alt="Payment QR Code - VasanthaKumar Rajendran - vasanthakumar141099@oksbi" 
                className="w-64 h-auto rounded-lg border-2 border-border shadow-lg"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium">VasanthaKumar Rajendran</p>
              <p className="text-sm text-muted-foreground">UPI ID: vasanthakumar141099@oksbi</p>
            </div>
          </div>
        )}
        
        {value === "upi" && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm">UPI Payment Instructions</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Open your preferred UPI app (Google Pay, PhonePe, Paytm, BHIM)</p>
              <p>• Enter UPI ID: <span className="font-semibold text-foreground">vasanthakumar141099@oksbi</span></p>
              <p>• Enter the order amount and complete payment</p>
              <p>• Instant payment confirmation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
