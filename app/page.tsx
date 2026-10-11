import Link from "next/link";
import { getProfile, signOut } from "@/app/actions/auth";
import CartIcon from "@/app/components/cart-icon";
import MobileNav from "@/app/components/mobile-nav";

export default async function HomePage() {
  const { user, profile } = await getProfile();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--surface-200)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-600)] text-white shadow-md">
                <span className="font-bold">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                Lumina
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/" className="text-slate-900 font-semibold">Home</Link>
              <Link href="/products" className="hover:text-slate-900 transition-colors">Shop</Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <CartIcon />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Welcome back, {profile?.full_name || user.email}
                </span>
                <form action={signOut}>
                  <button className="rounded-lg border border-[var(--surface-200)] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[var(--surface-50)] active:scale-95">
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-700)] active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden bg-white pt-16 pb-32">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[1000px] rounded-full bg-[var(--brand-50)]/50 blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Elevate your everyday <br className="hidden sm:block" />
              with <span className="bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-400)] bg-clip-text text-transparent">Lumina Apparel</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
              Discover our latest collection of thoughtfully crafted, premium quality pieces designed for the modern lifestyle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href={user ? "/products" : "/signup"}
                className="rounded-xl bg-[var(--brand-600)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              >
                {user ? "Shop Collection" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
