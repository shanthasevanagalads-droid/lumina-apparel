"use client";

import Link from "next/link";
import { useCart } from "@/app/components/cart-context";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Cart</h1>
          <Link href="/products" className="text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)]">
            Continue Shopping &rarr;
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">Your cart is empty</h3>
            <p className="mt-2 text-slate-500">Looks like you haven't added any items to your cart yet.</p>
            <div className="mt-6">
              <Link href="/products" className="inline-flex items-center rounded-xl bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-700)]">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-sm">
                  <div className="h-24 w-24 relative flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="rounded-xl object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">₨ {item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center rounded-lg border border-[var(--surface-200)]">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-slate-600 hover:bg-[var(--surface-50)]">-</button>
                        <span className="px-3 py-1 text-sm font-medium text-slate-900 border-x border-[var(--surface-200)]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-slate-600 hover:bg-[var(--surface-50)]">+</button>
                      </div>
                      <p className="text-base font-bold text-slate-900">
                        ₨ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-2xl border border-[var(--surface-200)] bg-[var(--surface-50)] p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">₨ {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-[var(--brand-600)]">Free</span>
                  </div>
                  <div className="border-t border-[var(--surface-200)] pt-4 flex justify-between">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">₨ {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <Link href="/checkout" className="flex w-full items-center justify-center rounded-xl bg-[var(--brand-600)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-800/20 hover:bg-[var(--brand-700)] active:scale-95 transition-all">
                    Proceed to Checkout
                  </Link>
                  <button onClick={clearCart} className="flex w-full items-center justify-center rounded-xl border border-[var(--surface-200)] bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-[var(--surface-50)] active:scale-95 transition-all">
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
