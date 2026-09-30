"use client";

import { useCart } from "./cart-context";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-white transition-all active:scale-95"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Add to Cart
    </button>
  );
}
