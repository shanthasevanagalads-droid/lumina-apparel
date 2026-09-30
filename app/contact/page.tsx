import Link from "next/link";
import CartIcon from "@/app/components/cart-icon";
import { getProfile, signOut } from "@/app/actions/auth";

export default async function ContactPage() {
  const { user, profile } = await getProfile();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--surface-200)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-600)] text-white shadow-md">
                <span className="font-bold">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Lumina
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-slate-900 transition-colors">Shop</Link>
              <Link href="/contact" className="text-slate-900 font-semibold">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <CartIcon />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                  Welcome, {profile?.full_name || user.email}
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
                  className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-700)] active:scale-95 hidden sm:block"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-fade-in-up">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              We'd love to hear from you. Please fill out this form or shoot us an email.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-8 shadow-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input type="text" id="first-name" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input type="text" id="last-name" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input type="email" id="email" className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea id="message" rows={5} className="w-full rounded-xl border border-[var(--surface-200)] px-4 py-2.5 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]"></textarea>
              </div>

              <button type="submit" className="w-full rounded-xl bg-[var(--brand-600)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] active:scale-95">
                Send Message
              </button>
            </form>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900">Email</h3>
              <p className="mt-1 text-sm text-slate-500">support@luminaapparel.com</p>
            </div>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900">Phone</h3>
              <p className="mt-1 text-sm text-slate-500">+1 (555) 123-4567</p>
            </div>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900">Office</h3>
              <p className="mt-1 text-sm text-slate-500">123 Fashion Ave<br/>New York, NY 10001</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
