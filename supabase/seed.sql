-- ==============================================================================
-- Lumina Apparel - Supabase Database Setup: Seed Data
-- Run this script inside the Supabase SQL Editor AFTER running products_schema.sql
-- ==============================================================================

INSERT INTO public.products (name, description, price, image_url, category, inventory_count)
VALUES
('Classic White Tee', 'A comfortable and versatile classic white t-shirt made from 100% organic cotton.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', 'T-Shirts', 100),
('Black Denim Jacket', 'Premium black denim jacket with silver hardware and a relaxed fit.', 89.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800', 'Outerwear', 50),
('Vintage Wash Jeans', 'Straight leg vintage wash jeans with a comfortable high-rise fit.', 79.50, 'https://images.unsplash.com/photo-1542272604-780c85854619?auto=format&fit=crop&q=80&w=800', 'Pants', 75),
('Wool Blend Beanie', 'Cozy ribbed knit beanie perfect for colder weather.', 24.00, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800', 'Accessories', 200),
('Canvas Sneakers', 'Everyday canvas sneakers in off-white with durable rubber soles.', 59.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800', 'Footwear', 120),
('Oversized Hoodie', 'Ultra-soft fleece oversized hoodie in neutral grey.', 65.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', 'Sweatshirts', 85);
