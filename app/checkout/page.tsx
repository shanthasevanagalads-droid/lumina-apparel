"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/cart-context";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      router.push("/order-confirmation");
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <Link href="/products" className="mt-4 inline-block text-[var(--brand-600)] hover:underline">
            Go back to shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                    <input type="email" required className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                    <input type="text" required className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" required className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" required className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Postal code</label>
                    <input type="text" required className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div 
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-[var(--surface-200)]'}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <input type="radio" name="payment" id="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="h-4 w-4 text-[var(--brand-600)] focus:ring-[var(--brand-500)]" />
                    <label htmlFor="bank" className="font-medium text-slate-900 cursor-pointer w-full">Direct Bank Transfer</label>
                  </div>
                  {paymentMethod === 'bank' && (
                    <div className="pl-11 pr-4 pb-4 text-sm text-slate-600 animate-fade-in-up">
                      <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                      <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="font-medium">Bank Name: Standard Chartered</p>
                        <p className="font-medium">Account Name: Lumina Apparel</p>
                        <p className="font-medium">Account Number: 0000 1234 5678</p>
                      </div>
                    </div>
                  )}

                  <div 
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-[var(--surface-200)]'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input type="radio" name="payment" id="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-[var(--brand-600)] focus:ring-[var(--brand-500)]" />
                    <label htmlFor="card" className="font-medium text-slate-900 cursor-pointer w-full">Credit / Debit Card</label>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="pl-11 pr-4 pb-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Card number</label>
                        <input type="text" required placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiration date (MM/YY)</label>
                        <input type="text" required placeholder="MM/YY" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                        <input type="text" required placeholder="123" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                      </div>
                    </div>
                  )}

                  <div 
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-[var(--surface-200)]'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input type="radio" name="payment" id="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-[var(--brand-600)] focus:ring-[var(--brand-500)]" />
                    <label htmlFor="cod" className="font-medium text-slate-900 cursor-pointer w-full">Cash on Delivery (COD)</label>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="pl-11 pr-4 pb-4 text-sm text-slate-600 animate-fade-in-up">
                      <p>Pay with cash upon delivery.</p>
                    </div>
                  )}
                </div>
              </div>

              <button disabled={loading} type="submit" className="flex w-full items-center justify-center rounded-xl bg-[var(--brand-600)] px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-teal-800/20 hover:bg-[var(--brand-700)] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Processing Order..." : `Pay ₨ ${cartTotal.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="rounded-2xl border border-[var(--surface-200)] bg-[var(--surface-50)] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 relative">
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="rounded-lg object-cover border border-[var(--surface-200)]" />
                      </div>
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-slate-500">₨ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-slate-600 border-t border-[var(--surface-200)] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">₨ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[var(--brand-600)]">Free</span>
                </div>
                <div className="border-t border-[var(--surface-200)] pt-3 flex justify-between">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">₨ {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
