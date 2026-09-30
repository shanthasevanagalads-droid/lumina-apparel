import Link from "next/link";
import { getProfile } from "@/app/actions/auth";

export default async function OrderConfirmationPage() {
  const { profile } = await getProfile();

  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="max-w-xl w-full">
        <div className="rounded-3xl border border-[var(--surface-200)] bg-white p-10 text-center shadow-xl shadow-slate-200/50 relative overflow-hidden">

          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[var(--brand-50)] blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[var(--brand-100)] blur-3xl" />

          <div className="relative z-10">
            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
              <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              Order Confirmed!
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Thank you for your purchase{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}. We've received your order and will begin processing it right away.
            </p>

            <div className="rounded-2xl bg-[var(--surface-50)] p-6 mb-8 text-left border border-[var(--surface-200)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Order Details</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-600 font-medium">Order Number</span>
                <span className="text-slate-900 font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-600 font-medium">Date</span>
                <span className="text-slate-900 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Status</span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  Processing
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto flex justify-center items-center rounded-xl bg-[var(--brand-600)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-800/20 hover:bg-[var(--brand-700)] active:scale-95 transition-all">
                Continue Shopping
              </Link>
              <Link href="/" className="w-full sm:w-auto flex justify-center items-center rounded-xl border border-[var(--surface-200)] bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 hover:bg-[var(--surface-50)] active:scale-95 transition-all">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
