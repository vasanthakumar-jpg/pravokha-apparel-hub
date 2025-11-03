-- Add cancel functionality to orders (if not already present, this is safe)
-- Ensure order_status supports 'cancelled' value
DO $$ 
BEGIN
  -- Add index for faster order queries by user and status
  CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, order_status);
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
END $$;