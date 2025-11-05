import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { Package, Calendar, MapPin, CreditCard, XCircle } from "lucide-react";
import { format } from "date-fns";
import { CancelOrderDialog } from "@/components/CancelOrderDialog";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  items: any;
  shipping_address: string;
  shipping_city: string;
  shipping_pincode: string;
  customer_name: string;
  customer_phone: string;
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderAmount, setSelectedOrderAmount] = useState(0);

  useEffect(() => {
    checkUserAndLoadOrders();
  }, []);

  const checkUserAndLoadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view your orders",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadOrders(user.id);
  };

  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId: string, amount: number) => {
    setSelectedOrderId(orderId);
    setSelectedOrderAmount(amount);
    setCancelDialogOpen(true);
  };

  const cancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: "cancelled", payment_status: "refunded" })
        .eq("id", selectedOrderId)
        .eq("order_status", "pending");

      if (error) throw error;

      toast({
        title: "Order Cancelled",
        description: `Your order has been cancelled successfully. Refund of ₹${selectedOrderAmount} will be processed within 3-5 business days.`,
      });

      setCancelDialogOpen(false);
      setSelectedOrderId(null);

      // Reload orders
      if (user) {
        await loadOrders(user.id);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
        <Button onClick={() => navigate("/products")} size="lg">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <>
      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={cancelOrder}
        orderAmount={selectedOrderAmount}
      />
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Order #{order.order_number}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(order.created_at), "PPP")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    Payment: {order.payment_status}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Items
                </h3>
                <div className="space-y-3">
                  {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.colorName} • {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_city}, {order.shipping_pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_phone}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.payment_method === "upi" ? "UPI Payment" : 
                     order.payment_method === "qr" ? "QR Code Payment" : 
                     order.payment_method}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Total and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">₹{order.total}</p>
                </div>
                
                {order.order_status === "pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelClick(order.id, order.total)}
                    className="w-full sm:w-auto"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}
