"use client";

import { useCart } from "./cart-context";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slideUp sm:animate-none transform transition-transform duration-300 ease-in-out border-l border-[var(--surface-200)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-200)]">
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-[var(--surface-100)] rounded-full transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="mx-auto h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-slate-500">Looks like you haven't added anything yet.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 inline-flex items-center rounded-xl bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-700)] transition-colors"
              >
                Keep Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 relative flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="rounded-xl object-cover border border-[var(--surface-200)]" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-600">₨ {item.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center rounded-lg border border-[var(--surface-200)] h-7">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 h-full text-slate-600 hover:bg-[var(--surface-50)] rounded-l-lg leading-none">-</button>
                        <span className="px-2 text-xs font-medium text-slate-900 border-x border-[var(--surface-200)] h-full flex items-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-full text-slate-600 hover:bg-[var(--surface-50)] rounded-r-lg leading-none">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--surface-200)] bg-[var(--surface-50)] px-6 py-6">
            <div className="flex justify-between text-base font-bold text-slate-900 mb-6">
              <p>Subtotal</p>
              <p>₨ {cartTotal.toLocaleString()}</p>
            </div>
            <div className="space-y-3">
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-[var(--brand-600)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-800/20 hover:bg-[var(--brand-700)] active:scale-95 transition-all"
              >
                Proceed to Checkout
              </Link>
              <Link 
                href="/cart" 
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-[var(--brand-600)] bg-transparent px-6 py-3.5 text-sm font-bold text-[var(--brand-700)] hover:bg-[var(--brand-50)] active:scale-95 transition-all"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
