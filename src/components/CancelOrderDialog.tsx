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
}

export const CancelOrderDialog = ({ open, onOpenChange, onConfirm, orderAmount }: CancelOrderDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order Confirmation</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="font-medium">Are you sure you want to cancel your order?</p>
            <p>Upon confirmation, the payment of ₹{orderAmount} will be refunded to your original payment method.</p>
            <p className="text-sm text-muted-foreground">
              Please note: Refunds may take 3-5 business days to process and reflect in your account.
            </p>
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
