"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import UserNav from "./UserNav";

/* ─── Types ─────────────────────────────────────────────────────────── */

type Product = {
  id: number;
  title: string;
  category: "T-Shirts" | "Linen" | "Bags";
  price: number;
  image: string;
  alt: string;
  badge?: string;
};

/* ─── Data ──────────────────────────────────────────────────────────── */

const products: Product[] = [
  {
    id: 1,
    title: "Everyday Heavyweight Tee",
    category: "T-Shirts",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1752134594179-749457f5e422?auto=format&fit=crop&w=700&q=85",
    alt: "Neutral t-shirts styled in a minimal studio",
    badge: "Best Seller",
  },
  {
    id: 2,
    title: "Coastal Linen Shirt",
    category: "Linen",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1602956280248-66d6efd0ba7d?auto=format&fit=crop&w=700&q=85",
    alt: "Brown linen button-up shirt",
    badge: "New Arrival",
  },
  {
    id: 3,
    title: "Sunday Market Tote",
    category: "Bags",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?auto=format&fit=crop&w=700&q=85",
    alt: "White reusable tote bag on a neutral surface",
  },
  {
    id: 4,
    title: "Soft Structure Shirt",
    category: "Linen",
    price: 3450,
    image:
      "https://images.unsplash.com/photo-1779406166699-662a041a12a9?auto=format&fit=crop&w=700&q=85",
    alt: "Woman wearing a relaxed neutral shirt",
    badge: "Popular",
  },
  {
    id: 5,
    title: "Essential Black Carryall",
    category: "Bags",
    price: 2700,
    image:
      "https://images.unsplash.com/photo-1578237493287-8d4d2b03591a?auto=format&fit=crop&w=700&q=85",
    alt: "Minimal black carryall bag",
  },
  {
    id: 6,
    title: "Natural Canvas Shopper",
    category: "Bags",
    price: 1450,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85",
    alt: "Natural canvas shopping bag",
  },
];

const categories = ["All Items", "T-Shirts", "Linen", "Bags"] as const;

/* ─── Helpers ───────────────────────────────────────────────────────── */

const money = (value: number) => `LKR ${value.toLocaleString("en-US")}`;

/* ─── Icon Components ───────────────────────────────────────────────── */

function BagIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6.5 8.5h11l1 12h-13l1-12Z" strokeLinejoin="round" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        d="m5 12 4.2 4.2L19 6.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.46 14.87L2.05 22l5.27-1.49A9.98 9.98 0 1 0 12.04 2Zm0 17.96a8 8 0 0 1-4.08-1.11l-.29-.17-3.13.88.89-3.04-.19-.31a7.85 7.85 0 1 1 6.8 3.75Zm4.38-5.88c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19a7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

function TruckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 3h15v13H1z" strokeLinejoin="round" />
      <path d="M16 8h4l3 4v5h-7V8z" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinejoin="round" />
    </svg>
  );
}


/* ─── Main Storefront Component ─────────────────────────────────────── */

export default function Storefront() {
  const [category, setCategory] = useState("All Items");
  const [cart, setCart] = useState<Record<number, number>>({ 1: 1, 2: 1 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [zone, setZone] = useState<"western" | "outstation">("western");
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ── Scroll detection ────────────────────────────────────────────── */

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Lock body scroll when drawer/modal open ─────────────────────── */

  useEffect(() => {
    if (drawerOpen || confirmed || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, confirmed, mobileMenuOpen]);

  /* ── Derived state ──────────────────────────────────────────────── */

  const visibleProducts =
    category === "All Items"
      ? products
      : products.filter((product) => product.category === category);

  const cartItems = products.filter((product) => cart[product.id]);

  const itemCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const subtotal = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.price * (cart[product.id] || 0),
        0,
      ),
    [cart],
  );

  const delivery = zone === "western" ? 350 : 500;

  /* ── Cart actions ───────────────────────────────────────────────── */

  const updateQuantity = useCallback((id: number, change: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + change);
      const updated = { ...current };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((current) => {
      const updated = { ...current };
      delete updated[id];
      return updated;
    });
  }, []);

  const confirmOrder = () => {
    setDrawerOpen(false);
    window.setTimeout(() => setConfirmed(true), 180);
  };

  const copyAccount = async () => {
    await navigator.clipboard?.writeText("011234567890");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  /* ── Navigation ─────────────────────────────────────────────────── */

  const navigateTo = useCallback((target: string) => {
    setMobileMenuOpen(false);
    if (target === "Shop" || target === "Shop All" || target === "Best Sellers") {
      setCategory("All Items");
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (target === "New Arrivals") {
      setCategory("All Items");
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (target === "About" || target === "About Us") {
      document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="min-h-dvh bg-[var(--background)]">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER / NAVIGATION
       ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-[var(--surface-200)] shadow-[0_1px_12px_rgba(15,23,42,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-600)] text-white shadow-lg shadow-teal-800/20">
              <span className="text-lg font-bold tracking-tight">L</span>
              <div className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--brand-400)] text-white ring-2 ring-white">
                <CheckIcon className="h-2.5 w-2.5" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold tracking-tight">Lumina Apparel</h1>
              <p className="text-[11px] font-medium text-slate-500">
                Colombo • Islandwide Delivery
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {["Shop", "New Arrivals", "About"].map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(item)}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--brand-600)]"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (desktop) */}
            <button
              className="hidden h-10 w-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-[var(--surface-100)] hover:text-slate-700 sm:grid"
              aria-label="Search products"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            {/* User auth navigation */}
            <UserNav />

            {/* Cart button */}
            <button
              id="cart-trigger"
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-[var(--brand-600)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl hover:shadow-teal-800/25 active:scale-[0.98]"
            >
              <BagIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {money(subtotal).replace("LKR ", "")}
              </span>
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-[var(--brand-600)] shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-[var(--surface-100)] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        <div
          className={`overflow-hidden border-t border-[var(--surface-200)] bg-white transition-all duration-300 md:hidden ${
            mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            {["Shop", "New Arrivals", "About"].map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(item)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-[var(--surface-50)]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
       ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[var(--header-height)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left — copy */}
            <div className="animate-fade-in-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-200)] bg-[var(--brand-50)] px-4 py-1.5 text-xs font-semibold text-[var(--brand-700)]">
                <SparkleIcon className="h-3.5 w-3.5" />
                New Season Collection 2026
              </div>
              <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                Everyday pieces,{" "}
                <span className="bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-400)] bg-clip-text text-transparent">
                  thoughtfully
                </span>{" "}
                made.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
                Curated essentials designed for comfort, style, and the island life.
                Premium fabrics. Islandwide delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-600)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl hover:shadow-teal-800/25 active:scale-[0.98]"
                >
                  Shop Collection
                  <span aria-hidden="true">→</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-[var(--surface-300)] hover:shadow-md active:scale-[0.98]">
                  Learn More
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4 text-[var(--brand-500)]" />
                  <span>Free Shipping 5k+</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldIcon className="h-4 w-4 text-[var(--brand-500)]" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="h-4 w-4 text-[var(--brand-500)]" />
                  <span>Made with Care</span>
                </div>
              </div>
            </div>

            {/* Right — hero image mosaic */}
            <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: "200ms" }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={products[0].image}
                      alt={products[0].alt}
                      fill
                      sizes="300px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={products[5].image}
                      alt={products[5].alt}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={products[1].image}
                      alt={products[1].alt}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={products[3].image}
                      alt={products[3].alt}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Floating stats card */}
              <div className="absolute -left-6 bottom-24 z-10 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-2xl font-extrabold tracking-tight text-[var(--brand-600)]">500+</p>
                <p className="text-xs font-medium text-slate-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-[var(--brand-50)]/50 to-transparent" />
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--brand-100)] opacity-40 blur-[100px]" />
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          PRODUCTS SECTION
       ═══════════════════════════════════════════════════════════════ */}
      <section id="products-section" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Section header + filter pills */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-600)]">
              Our Collection
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Browse Our Products
            </h2>
          </div>

          {/* Category filter pills */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {categories.map((item) => (
              <button
                key={item}
                id={`filter-${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  category === item
                    ? "bg-[var(--brand-600)] text-white shadow-md shadow-teal-800/15"
                    : "border border-[var(--surface-200)] bg-white text-slate-600 hover:border-[var(--brand-200)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid — responsive: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const quantity = cart[product.id] || 0;
            return (
              <article
                key={product.id}
                id={`product-${product.id}`}
                className="group overflow-hidden rounded-2xl border border-[var(--surface-200)]/60 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-100)]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[var(--brand-600)] shadow-sm backdrop-blur-sm">
                      {product.badge}
                    </span>
                  )}
                  {/* Quick add overlay on hover — desktop */}
                  {!quantity && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-full rounded-xl bg-white py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-[var(--brand-50)] active:scale-[0.98]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                  {/* In Stock pill */}
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--brand-50)]/90 px-2.5 py-1 text-[10px] font-bold text-[var(--brand-700)] backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-400)]" />
                    In Stock
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {product.category}
                  </p>
                  <h3 className="text-base font-bold leading-snug tracking-tight">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-lg font-extrabold tracking-tight text-[var(--brand-600)]">
                    {money(product.price)}
                  </p>

                  {/* Cart controls */}
                  {quantity ? (
                    <div className="mt-4 flex h-11 items-center justify-between rounded-xl bg-[var(--brand-600)] px-1.5 text-white">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="grid h-8 w-9 place-items-center rounded-lg text-lg transition hover:bg-white/15 active:scale-95"
                        aria-label={`Remove one ${product.title}`}
                      >
                        −
                      </button>
                      <span className="text-sm font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="grid h-8 w-9 place-items-center rounded-lg text-lg transition hover:bg-white/15 active:scale-95"
                        aria-label={`Add one ${product.title}`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="mt-4 h-11 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] text-sm font-bold text-slate-700 transition-all hover:border-[var(--brand-200)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-[0.98] sm:hidden"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          FLOATING CART BAR (bottom of screen)
       ═══════════════════════════════════════════════════════════════ */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 animate-fade-in-up rounded-2xl border border-white/70 bg-white/90 p-2.5 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:bottom-6">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1 pl-3">
              <p className="text-xs font-semibold text-slate-500">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
              </p>
              <p className="text-base font-extrabold tracking-tight">{money(subtotal)}</p>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand-600)] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl active:scale-[0.98]"
            >
              View Cart & Checkout
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════════
          CART DRAWER (Slide-over panel)
       ═══════════════════════════════════════════════════════════════ */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[3px] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel — slides from right on desktop, bottom on mobile */}
      <aside
        aria-label="Checkout"
        className={`fixed z-50 flex flex-col bg-[var(--surface-50)] shadow-[var(--shadow-modal)] transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-[28px]
          sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[460px] sm:rounded-t-none sm:rounded-l-3xl
          ${drawerOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          }`}
      >
        {/* Drag handle — mobile */}
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300 sm:hidden" />

        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[var(--surface-200)] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-600)]">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Your Bag</h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:bg-[var(--surface-100)] hover:text-slate-700"
            aria-label="Close cart"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
          {/* Cart items */}
          <div className="space-y-3 py-4">
            {cartItems.length === 0 && (
              <div className="py-12 text-center">
                <BagIcon className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                <p className="text-sm font-semibold text-slate-400">Your bag is empty</p>
              </div>
            )}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={72}
                  height={72}
                  className="h-18 w-18 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{item.title}</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">{item.category}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--brand-600)]">
                    {money(item.price)}
                  </p>
                  <div className="mt-2 flex w-fit items-center rounded-lg bg-[var(--surface-100)]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-sm transition hover:bg-[var(--surface-200)]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-xs font-bold">
                      {cart[item.id]}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-sm transition hover:bg-[var(--surface-200)]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.title}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {/* Delivery details form */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold">Delivery Details</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] px-4 text-sm outline-none transition focus:border-[var(--brand-500)] focus:ring-2 focus:ring-teal-700/10"
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  WhatsApp Number
                </span>
                <div className="flex h-12 overflow-hidden rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] focus-within:border-[var(--brand-500)] focus-within:ring-2 focus-within:ring-teal-700/10">
                  <span className="grid place-items-center border-r border-[var(--surface-200)] px-4 text-sm font-semibold text-slate-500">
                    +94
                  </span>
                  <input
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                    inputMode="tel"
                    placeholder="77 123 4567"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Delivery Address
                </span>
                <textarea
                  className="min-h-24 w-full resize-none rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] p-4 text-sm outline-none transition focus:border-[var(--brand-500)] focus:ring-2 focus:ring-teal-700/10"
                  placeholder="Street, city and postal code"
                />
              </label>
            </div>
          </div>

          {/* Delivery zone selector */}
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold">Delivery Zone</h3>
            <div className="space-y-2">
              {[
                { id: "western", label: "Western Province", fee: 350 },
                { id: "outstation", label: "Outstation", fee: 500 },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    zone === option.id
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)]/60 shadow-sm"
                      : "border-[var(--surface-200)] hover:border-[var(--surface-300)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="zone"
                    checked={zone === option.id}
                    onChange={() =>
                      setZone(option.id as "western" | "outstation")
                    }
                    className="h-4 w-4 accent-[var(--brand-600)]"
                  />
                  <span className="flex-1 text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    {money(option.fee)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Order summary & WhatsApp CTA */}
          <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-900/20">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery fee</span>
                <span>{money(delivery)}</span>
              </div>
              <div className="my-3 border-t border-white/10" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold">Grand total</span>
                <span className="text-2xl font-extrabold tracking-tight">
                  {money(subtotal + delivery)}
                </span>
              </div>
            </div>
            <button
              id="checkout-whatsapp"
              onClick={confirmOrder}
              disabled={itemCount === 0}
              className="mt-5 flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--accent-whatsapp)] text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              <WhatsAppIcon />
              Send Order via WhatsApp
            </button>
          </div>
        </div>
      </aside>


      {/* ═══════════════════════════════════════════════════════════════
          ORDER CONFIRMATION MODAL
       ═══════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-8 backdrop-blur-sm transition sm:items-center sm:py-10 ${
          confirmed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Order confirmed"
          className={`my-auto w-full max-w-md rounded-3xl bg-white p-5 shadow-[var(--shadow-modal)] transition duration-300 sm:p-8 ${
            confirmed
              ? "animate-scale-in"
              : "scale-95 translate-y-3"
          }`}
        >
          {/* Check icon */}
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-[var(--brand-600)] ring-8 ring-emerald-50">
            <CheckIcon className="h-8 w-8" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand-600)]">
              Thank you
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Order Confirmed
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Your order summary is ready to send. We&apos;ll confirm
              delivery over WhatsApp.
            </p>
          </div>

          {/* Receipt */}
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-[var(--surface-50)] p-5 font-mono text-xs leading-6 text-slate-600">
            <div className="mb-2 flex items-center justify-between border-b border-dashed border-slate-300 pb-2 text-slate-900">
              <span>ORDER RECEIPT</span>
              <span className="font-bold">#LA-101</span>
            </div>
            <p>ITEMS ................. {itemCount}</p>
            <p>
              DELIVERY ........{" "}
              {zone === "western" ? "WESTERN" : "OUTSTATION"}
            </p>
            <p>PAYMENT ........ BANK TRANSFER</p>
            <div className="mt-2 flex justify-between border-t border-dashed border-slate-300 pt-2 font-bold text-slate-900">
              <span>TOTAL</span>
              <span>{money(subtotal + delivery)}</span>
            </div>
          </div>

          {/* Bank transfer details */}
          <div className="mt-4 rounded-2xl border border-teal-100 bg-[var(--brand-50)]/70 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-600)]">
                Bank transfer details
              </p>
              <button
                onClick={copyAccount}
                className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--brand-600)] shadow-sm transition hover:shadow-md"
              >
                {copied ? "Copied ✓" : "Copy number"}
              </button>
            </div>
            <dl className="grid grid-cols-[80px_1fr] gap-y-1.5 text-sm">
              <dt className="text-slate-500">Account</dt>
              <dd className="font-semibold">Lumina Apparel</dd>
              <dt className="text-slate-500">Number</dt>
              <dd className="font-semibold">0112 3456 7890</dd>
              <dt className="text-slate-500">Branch</dt>
              <dd className="font-semibold">
                Commercial Bank • Colombo 03
              </dd>
            </dl>
          </div>

          <button
            onClick={() => setConfirmed(false)}
            className="mt-6 h-12 w-full rounded-xl border border-[var(--surface-200)] bg-white text-sm font-bold text-slate-700 transition hover:bg-[var(--surface-50)] hover:shadow-sm active:scale-[0.98]"
          >
            Continue Shopping
          </button>
        </section>
      </div>


      {/* ═══════════════════════════════════════════════════════════════
          ABOUT SECTION
       ═══════════════════════════════════════════════════════════════ */}
      <section id="about-section" className="border-t border-[var(--surface-200)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — text */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-600)]">
                Our Story
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Made for the island life
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
                Lumina Apparel was born in Colombo with a simple idea — create everyday essentials that feel as good as they look. We source premium fabrics, work with local artisans, and ship islandwide so you can look your best without the fuss.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
                From heavyweight tees to breathable linen shirts and durable canvas bags, every piece is designed for comfort, durability, and effortless style.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { stat: "500+", label: "Happy Customers" },
                  { stat: "100%", label: "Premium Fabrics" },
                  { stat: "2-3", label: "Days Delivery" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl font-extrabold tracking-tight text-[var(--brand-600)] sm:text-3xl">{item.stat}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85"
                  alt="Behind the scenes at Lumina Apparel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur-xl sm:-bottom-6 sm:-left-6">
                <p className="text-sm font-bold">🇱🇰 Proudly Sri Lankan</p>
                <p className="mt-0.5 text-xs text-slate-500">Colombo 03, since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
       ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--surface-200)] bg-white pb-32 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-600)] text-white">
                  <span className="text-lg font-bold">L</span>
                </div>
                <span className="text-lg font-bold tracking-tight">Lumina Apparel</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                Everyday pieces, thoughtfully made for the island life.
                Premium fabrics with islandwide delivery across Sri Lanka.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {["Shop All", "New Arrivals", "Best Sellers", "About Us"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => navigateTo(link)}
                      className="text-sm text-slate-600 transition hover:text-[var(--brand-600)]"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                Get in Touch
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <WhatsAppIcon />
                  <span>+94 77 123 4567</span>
                </li>
                <li className="text-sm text-slate-600">hello@luminaapparel.lk</li>
                <li className="text-sm text-slate-600">Colombo 03, Sri Lanka</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--surface-200)] pt-6 sm:flex-row">
            <p className="text-xs text-slate-400">
              © 2026 Lumina Apparel. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Shipping"].map((link) => (
                <button key={link} className="text-xs text-slate-400 transition hover:text-[var(--brand-600)]">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
