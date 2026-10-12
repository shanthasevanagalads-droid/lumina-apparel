"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/add-to-cart-button";
import { Search, Filter, ArrowUpDown, X, PackageX, Sparkles } from "lucide-react";

export interface ProductItem {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  currency?: string;
  image_url?: string;
  image?: string;
  category?: string;
  inventory_count?: number;
  isNew?: boolean;
}

interface ProductCatalogProps {
  products: ProductItem[];
}

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Format currency
  const formatPrice = (price: number | string, currency: string = "USD") => {
    const num = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
    if (currency === "USD" || currency === "$" || !currency) {
      return `$${num.toFixed(2)}`;
    }
    if (currency === "PKR" || currency === "₨") {
      return `₨ ${num.toLocaleString()}`;
    }
    return `${currency} ${num.toLocaleString()}`;
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        // Category filter
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        if (!matchesCategory) return false;

        // Search filter
        if (!query) return true;
        return (
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^0-9.-]+/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^0-9.-]+/g, "")) || 0;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // featured/default
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search, Category Chips & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-600)] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-500)]/20 focus:border-[var(--brand-600)] outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[var(--brand-600)] text-white shadow-md shadow-teal-900/10"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20 shadow-sm cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Results Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== "All" || sortBy !== "featured") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSortBy("featured");
            }}
            className="text-[var(--brand-600)] hover:underline flex items-center gap-1"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Product Grid / Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-16 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-[var(--brand-600)] mx-auto mb-4 shadow-sm">
            <PackageX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            We couldn't find any items matching your active filter criteria. Try adjusting your search query or category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 bg-[var(--brand-600)] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[var(--brand-700)] transition-all"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product, idx) => {
            const imgSrc = product.image_url || product.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800";
            const priceLabel = formatPrice(product.price, product.currency);
            const isOutOfStock = typeof product.inventory_count === "number" && product.inventory_count === 0;

            return (
              <div 
                key={String(product.id)} 
                className="group relative flex flex-col animate-scale-in" 
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--surface-100)] border border-slate-100 shadow-sm">
                  {product.isNew && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-[var(--brand-900)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      New
                    </div>
                  )}

                  {typeof product.inventory_count === "number" && product.inventory_count <= 5 && !isOutOfStock && (
                    <div className="absolute top-4 right-4 z-10 rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                      Only {product.inventory_count} left
                    </div>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Add to Cart Overlay */}
                  {!isOutOfStock && (
                    <div className="absolute inset-x-0 bottom-0 z-20 p-4 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <AddToCartButton 
                        product={{
                          id: String(product.id),
                          name: product.name,
                          price: product.price,
                          currency: product.currency || "USD",
                          image: imgSrc,
                          image_url: imgSrc,
                        }} 
                      />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {product.category || "Apparel"}
                      </p>
                      <h3 className="mt-1 text-base font-bold text-slate-900 group-hover:text-[var(--brand-600)] transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-base font-bold text-[var(--brand-700)] bg-[var(--brand-50)] px-2.5 py-1 rounded-lg shrink-0">
                      {priceLabel}
                    </p>
                  </div>

                  {product.description && (
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
