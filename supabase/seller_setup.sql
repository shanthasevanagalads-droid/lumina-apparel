-- ==============================================================================
-- Lumina Apparel - Full Storefront Control & Seller Dashboard Setup
-- Run this script in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Ensure 'products' table exists with all required fields
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  image_url TEXT,
  category TEXT,
  inventory_count INTEGER DEFAULT 0 NOT NULL,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for storefront)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Allow full management for products (insert, update, delete)
DROP POLICY IF EXISTS "Allow product insert" ON public.products;
CREATE POLICY "Allow product insert"
  ON public.products FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow product update" ON public.products;
CREATE POLICY "Allow product update"
  ON public.products FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow product delete" ON public.products;
CREATE POLICY "Allow product delete"
  ON public.products FOR DELETE
  USING (true);


-- 2. Create 'orders' table for checkout and seller order fulfillment
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Processing', 'Completed', 'Cancelled'
  items_count INTEGER DEFAULT 1 NOT NULL,
  shipping_address JSONB,
  payment_method TEXT DEFAULT 'card',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders"
  ON public.orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Anyone can update orders"
  ON public.orders FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- 3. Create 'order_items' table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create order_items" ON public.order_items;
CREATE POLICY "Anyone can create order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view order_items" ON public.order_items;
CREATE POLICY "Anyone can view order_items"
  ON public.order_items FOR SELECT
  USING (true);


-- 4. Seed initial orders if empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.orders LIMIT 1) THEN
    INSERT INTO public.orders (order_number, customer_name, customer_email, total_amount, currency, status, items_count, payment_method, created_at)
    VALUES
      ('ORD-9021', 'Liam Johnson', 'liam@example.com', 125.00, 'USD', 'Completed', 3, 'card', NOW() - INTERVAL '2 hours'),
      ('ORD-9020', 'Olivia Smith', 'olivia@example.com', 120.00, 'USD', 'Processing', 1, 'card', NOW() - INTERVAL '5 hours'),
      ('ORD-9019', 'Noah Williams', 'noah@example.com', 95.00, 'USD', 'Completed', 2, 'bank', NOW() - INTERVAL '1 day'),
      ('ORD-9018', 'Emma Brown', 'emma@example.com', 45.00, 'USD', 'Pending', 1, 'card', NOW() - INTERVAL '1 day'),
      ('ORD-9017', 'Ava Jones', 'ava@example.com', 210.00, 'USD', 'Cancelled', 4, 'card', NOW() - INTERVAL '2 days'),
      ('ORD-9016', 'William Davis', 'will@example.com', 85.00, 'USD', 'Completed', 1, 'cod', NOW() - INTERVAL '3 days');
  END IF;
END $$;
