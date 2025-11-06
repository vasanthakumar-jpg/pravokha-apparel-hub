import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderAmount: number;
  paymentStatus: string;
}

export const CancelOrderDialog = ({ open, onOpenChange, onConfirm, orderAmount, paymentStatus }: CancelOrderDialogProps) => {
  const getPaymentMessage = () => {
    if (paymentStatus === "completed" || paymentStatus === "success") {
      return (
        <>
          <p className="font-medium text-base">Payment Completed</p>
          <p>The payment of ₹{orderAmount} will be refunded to your original payment method.</p>
          <p className="text-sm text-muted-foreground">
            <strong>Refund Timeline:</strong> 3–5 business days. You'll receive confirmation once processed.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p className="font-medium text-base">Payment Pending</p>
          <p>No refund process initiated as payment is still pending.</p>
          <p className="text-sm text-muted-foreground">
            If payment completes later, refund timelines (3–5 business days) will be communicated.
          </p>
        </>
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order Confirmation</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="font-medium">Are you sure you want to cancel your order?</p>
            {getPaymentMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm Cancellation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
