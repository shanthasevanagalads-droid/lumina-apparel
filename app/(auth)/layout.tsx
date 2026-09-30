import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account — Lumina Apparel",
  description:
    "Sign in or create your Lumina Apparel account for a seamless shopping experience.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* ── Left: Branding panel (hidden on mobile) ──────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[var(--brand-800)] via-[var(--brand-700)] to-[var(--brand-600)]">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-20 -right-20 h-64 w-64 rounded-full bg-[var(--brand-400)]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12 xl:px-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
              <span className="text-lg font-bold tracking-tight">L</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Lumina Apparel
              </span>
              <p className="text-[11px] font-medium text-white/50">
                Colombo • Islandwide Delivery
              </p>
            </div>
          </Link>

          {/* Hero copy */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold leading-tight text-white xl:text-4xl">
              Everyday pieces,{" "}
              <span className="bg-gradient-to-r from-[var(--brand-200)] to-[var(--brand-400)] bg-clip-text text-transparent">
                thoughtfully
              </span>{" "}
              made.
            </h2>
            <p className="text-base leading-relaxed text-white/60 max-w-sm">
              Create your account to track orders, save favorites, and enjoy an
              elevated shopping experience.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-5 pt-2">
              <div className="flex items-center gap-2 text-white/40">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M1 3h15v13H1z" strokeLinejoin="round" />
                  <path d="M16 8h4l3 4v5h-7V8z" strokeLinejoin="round" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="text-xs font-medium">Island Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium">Premium</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Lumina Apparel. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right: Form area ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        {/* Mobile logo (visible on small screens) */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-3 lg:hidden"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-600)] text-white shadow-lg shadow-teal-800/20">
            <span className="text-lg font-bold tracking-tight">L</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">
              Lumina Apparel
            </span>
            <p className="text-[11px] font-medium text-slate-500">
              Colombo • Islandwide Delivery
            </p>
          </div>
        </Link>

        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
