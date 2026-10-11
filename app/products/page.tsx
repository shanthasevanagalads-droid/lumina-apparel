import Link from "next/link";
import { getProfile, signOut } from "@/app/actions/auth";
import Image from "next/image";
import AddToCartButton from "@/app/components/add-to-cart-button";
import CartIcon from "@/app/components/cart-icon";
import MobileNav from "@/app/components/mobile-nav";

// Mock Data for Premium Apparel
const PRODUCTS = [
  {
    id: 1,
    name: "Classic Linen Overshirt",
    price: "₨ 8,500",
    category: "Men's Collection",
    image: "/classic_linen_overshirt.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Minimalist Essential Tee",
    price: "₨ 3,200",
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Tailored Chino Trousers",
    price: "₨ 7,900",
    category: "Men's Bottoms",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Silk Blend Resort Shirt",
    price: "₨ 9,500",
    category: "Summer Edit",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    isNew: true,
  },
  {
    id: 5,
    name: "Structured Denim Jacket",
    price: "₨ 14,000",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    name: "Merino Wool Knit Sweater",
    price: "₨ 12,500",
    category: "Winter Essentials",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
  },
];

export default async function ProductsPage() {
  const { user, profile } = await getProfile();

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest Arrivals
            </h1>
            <p className="mt-2 text-base text-slate-500 max-w-xl">
              Explore our curated selection of premium apparel. Designed for comfort, styled for everyday elegance.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--surface-50)] transition-all">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[var(--surface-50)] transition-all">
              Sort by: Featured
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {PRODUCTS.map((product, idx) => (
            <div key={product.id} className="group relative animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--surface-100)]">
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-[var(--brand-900)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    New
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <AddToCartButton product={product} />
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    <Link href="#">
                      <span className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <p className="text-base font-bold text-slate-900 bg-[var(--brand-50)] px-2 py-1 rounded-md text-[var(--brand-700)]">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
