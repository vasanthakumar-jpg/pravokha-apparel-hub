-- Add status column to reviews table
ALTER TABLE reviews 
ADD COLUMN status TEXT DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create orders table for order persistence
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
  payment_method TEXT,
  payment_id TEXT,
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on order_number for quick lookups
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images', 
  'review-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Storage policies for review images
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'review-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own review images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'review-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own review images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'review-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update reviews RLS policy to hide user_id
-- First, drop the existing policy
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;

-- Create new policy that doesn't expose user_id (handled in application layer)
CREATE POLICY "Anyone can view approved reviews"
ON reviews FOR SELECT
USING (status = 'approved');