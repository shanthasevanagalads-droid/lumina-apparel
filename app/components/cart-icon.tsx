"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors">
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[var(--brand-500)] rounded-full shadow-sm">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
