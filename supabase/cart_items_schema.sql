-- ==============================================================================
-- Lumina Apparel - Supabase Database Setup: Cart Items Table
-- Run this script inside the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own cart items
CREATE POLICY "Users can view own cart items"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own cart items
CREATE POLICY "Users can insert own cart items"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own cart items
CREATE POLICY "Users can update own cart items"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for the table
alter publication supabase_realtime add table public.cart_items;
