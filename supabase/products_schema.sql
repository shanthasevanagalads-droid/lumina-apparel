-- ==============================================================================
-- Lumina Apparel - Supabase Database Setup: Products Table
-- Run this script inside the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  image_url TEXT,
  category TEXT,
  inventory_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Only authenticated users (or maybe admins in the future) can insert/update/delete.
-- For now, we restrict modifications to no one via public API, meaning only Supabase admin can modify.
