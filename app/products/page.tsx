import Link from "next/link";
import { getProfile, signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import CartIcon from "@/app/components/cart-icon";
import MobileNav from "@/app/components/mobile-nav";
import ProductCatalog, { ProductItem } from "./ProductCatalog";

// Curated fallback in case the database is temporarily unreachable or empty
const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: "fb-1",
    name: "Classic Linen Overshirt",
    price: 85.00,
    currency: "USD",
    category: "Men's Collection",
    image_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800",
    description: "Breathable pure linen overshirt tailored for everyday smart-casual layering.",
    inventory_count: 24,
    isNew: true,
  },
  {
    id: "fb-2",
    name: "Minimalist Essential Tee",
    price: 32.00,
    currency: "USD",
    category: "Essentials",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Ultra-soft 100% organic cotton staple tee featuring clean seams and durable neck rib.",
    inventory_count: 50,
  },
  {
    id: "fb-3",
    name: "Tailored Chino Trousers",
    price: 79.00,
    currency: "USD",
    category: "Men's Bottoms",
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    description: "Modern tapered chinos woven from comfortable stretch cotton twill.",
    inventory_count: 18,
  },
  {
    id: "fb-4",
    name: "Silk Blend Resort Shirt",
    price: 95.00,
    currency: "USD",
    category: "Summer Edit",
    image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight Cuban-collar shirt cut from a luxurious silk-cotton blend.",
    inventory_count: 12,
    isNew: true,
  },
  {
    id: "fb-5",
    name: "Structured Denim Jacket",
    price: 140.00,
    currency: "USD",
    category: "Outerwear",
    image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800",
    description: "Heavyweight 14oz raw selvedge denim jacket finished with matte silver hardware.",
    inventory_count: 8,
  },
  {
    id: "fb-6",
    name: "Merino Wool Knit Sweater",
    price: 125.00,
    currency: "USD",
    category: "Winter Essentials",
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    description: "Fine gauge extrafine merino wool crewneck providing natural thermoregulation.",
    inventory_count: 15,
  },
];

export default async function ProductsPage() {
  const { user, profile } = await getProfile();

  // Fetch real products dynamically from Supabase
  let products: ProductItem[] = [];
  try {
    const supabase = await createClient();
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase products query error:", error.message);
      products = FALLBACK_PRODUCTS;
    } else if (dbProducts && dbProducts.length > 0) {
      products = dbProducts;
    } else {
      products = FALLBACK_PRODUCTS;
    }
  } catch (err) {
    console.error("Failed to connect to Supabase products table:", err);
    products = FALLBACK_PRODUCTS;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--surface-200)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-600)] text-white shadow-md">
                <span className="font-bold">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                Lumina
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <Link href="/products" className="text-slate-900 font-semibold">Shop</Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <CartIcon />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                  Welcome, {profile?.full_name || user.email?.split("@")[0]}
                </span>
                <form action={signOut}>
                  <button className="rounded-lg border border-[var(--surface-200)] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[var(--surface-50)] active:scale-95">
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-700)] active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-[var(--brand-700)] text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Live Supabase Catalog
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest Arrivals
            </h1>
            <p className="mt-2 text-base text-slate-500 max-w-xl">
              Explore our curated selection of premium apparel. Designed for comfort, styled for everyday elegance.
            </p>
          </div>
        </div>

        {/* Dynamic Product Catalog with Search, Filters & Sorting */}
        <ProductCatalog products={products} />
      </main>
    </div>
  );
}
