"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    // If signIn succeeds, it redirects (never returns).
    // If it fails, we get the error back.
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your Lumina Apparel account to continue shopping.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-scale-in">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m1 1 22 22" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-600)] text-sm font-semibold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl hover:shadow-teal-800/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              Sign in
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--surface-200)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--background)] px-4 text-xs font-medium text-slate-400">
            New to Lumina?
          </span>
        </div>
      </div>

      {/* Switch to signup */}
      <Link
        href="/signup"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white text-sm font-semibold text-slate-700 transition-all hover:border-[var(--brand-500)]/30 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]"
      >
        Create an account
      </Link>
    </div>
  );
}
