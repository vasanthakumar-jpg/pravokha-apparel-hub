import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Smartphone, QrCode, CheckCircle } from "lucide-react";
import paymentQR from "@/assets/payment-qr.png";

interface UpiPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  orderNumber: string;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
}

interface PaymentDetails {
  method: "upi" | "qr";
  upiId?: string;
  transactionId: string;
  timestamp: string;
}

const UPI_ID = "vasanthakumar141099@oksbi";
const UPI_NAME = "VasanthaKumar Rajendran";

export const UpiPaymentDialog = ({ 
  open, 
  onClose, 
  amount, 
  orderNumber,
  onPaymentComplete 
}: UpiPaymentDialogProps) => {
  const [step, setStep] = useState<"method" | "upi-id" | "payment" | "verify">("method");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "qr">("upi");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [upiId, setUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const upiApps = [
    { id: "gpay", name: "Google Pay", scheme: "gpay://upi/pay" },
    { id: "phonepe", name: "PhonePe", scheme: "phonepe://pay" },
    { id: "paytm", name: "Paytm", scheme: "paytmmp://pay" },
  ];

  const generateUpiUrl = (appScheme: string) => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_NAME,
      am: amount.toString(),
      cu: "INR",
      tn: `Payment for Order ${orderNumber}`,
    });
    return `${appScheme}?${params.toString()}`;
  };

  const handleMethodSelect = () => {
    if (paymentMethod === "upi") {
      setStep("upi-id");
    } else {
      setStep("payment");
    }
  };

  const handleUpiSubmit = () => {
    if (!selectedApp) {
      toast({
        title: "Select Payment App",
        description: "Please select a UPI app to proceed",
        variant: "destructive",
      });
      return;
    }
    setStep("payment");
  };

  const handlePaymentRedirect = () => {
    if (paymentMethod === "upi" && selectedApp) {
      const app = upiApps.find(a => a.id === selectedApp);
      if (app) {
        const upiUrl = generateUpiUrl(app.scheme);
        window.location.href = upiUrl;
        
        // Fallback for desktop/web
        setTimeout(() => {
          toast({
            title: "Opening Payment App",
            description: `If the app doesn't open, please pay ₹${amount} to ${UPI_ID}`,
          });
        }, 1000);
      }
    }
    
    setStep("verify");
  };

  const handleVerifyPayment = () => {
    if (!transactionId || transactionId.length < 8) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid transaction ID",
        variant: "destructive",
      });
      return;
    }

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      upiId: paymentMethod === "upi" ? UPI_ID : undefined,
      transactionId,
      timestamp: new Date().toISOString(),
    };

    onPaymentComplete(paymentDetails);
    resetDialog();
  };

  const resetDialog = () => {
    setStep("method");
    setPaymentMethod("upi");
    setSelectedApp("");
    setUpiId("");
    setTransactionId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment - ₹{amount}</DialogTitle>
        </DialogHeader>

        {/* Step 1: Select Payment Method */}
        {step === "method" && (
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "upi" | "qr")}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                <RadioGroupItem value="upi" id="upi-method" />
                <Label htmlFor="upi-method" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Pay via UPI App</p>
                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                <RadioGroupItem value="qr" id="qr-method" />
                <Label htmlFor="qr-method" className="flex items-center gap-3 cursor-pointer flex-1">
                  <QrCode className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Scan QR Code</p>
                    <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button onClick={handleMethodSelect} className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Select UPI App */}
        {step === "upi-id" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Select your UPI app:</p>
              <RadioGroup value={selectedApp} onValueChange={setSelectedApp}>
                {upiApps.map((app) => (
                  <div key={app.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value={app.id} id={app.id} />
                    <Label htmlFor={app.id} className="cursor-pointer flex-1 font-medium">
                      {app.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Amount to Pay:</strong> ₹{amount}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                You'll be redirected to {selectedApp ? upiApps.find(a => a.id === selectedApp)?.name : "your app"} with payment details pre-filled
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleUpiSubmit} className="flex-1">
                Proceed to Pay
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment - QR or UPI Redirect */}
        {step === "payment" && (
          <div className="space-y-4">
            {paymentMethod === "qr" ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="font-semibold mb-2">Scan QR Code to Pay ₹{amount}</p>
                  <div className="flex justify-center my-4">
                    <img 
                      src={paymentQR} 
                      alt="Payment QR Code" 
                      className="w-64 h-auto rounded-lg border-2 border-border shadow-lg"
                    />
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{UPI_NAME}</p>
                    <p className="text-muted-foreground">UPI ID: {UPI_ID}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">Ready to Pay</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Click below to open your UPI app and complete payment of ₹{amount}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => paymentMethod === "upi" ? setStep("upi-id") : setStep("method")} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePaymentRedirect} className="flex-1">
                {paymentMethod === "upi" ? "Open UPI App" : "I've Paid"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Verify Payment */}
        {step === "verify" && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium">
                Payment Verification Required
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Please enter the transaction ID from your payment app to confirm the payment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="txn-id">Transaction ID / UPI Reference Number</Label>
              <Input
                id="txn-id"
                placeholder="e.g., 123456789012"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Found in your payment app's transaction history
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("payment")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerifyPayment} className="flex-1">
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
