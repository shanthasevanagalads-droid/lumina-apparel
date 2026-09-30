"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Join Lumina Apparel for a premium shopping experience.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-scale-in">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m5 12 4.2 4.2L19 6.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="font-medium">{success}</p>
            <p className="mt-1 text-emerald-600/80">
              Once confirmed, you can{" "}
              <Link href="/login" className="font-semibold underline underline-offset-2">
                sign in here
              </Link>
              .
            </p>
          </div>
        </div>
      )}

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
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-fullname"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Full name
            </label>
            <input
              id="signup-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Doe"
              className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>
            <input
              id="signup-email"
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
            <label
              htmlFor="signup-password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="At least 6 characters"
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
            <p className="mt-1.5 text-xs text-slate-400">
              Must be at least 6 characters long.
            </p>
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
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
                Create account
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="font-medium text-slate-500 underline underline-offset-2 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-slate-500 underline underline-offset-2 cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--surface-200)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--background)] px-4 text-xs font-medium text-slate-400">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Switch to login */}
      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white text-sm font-semibold text-slate-700 transition-all hover:border-[var(--brand-500)]/30 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]"
      >
        Sign in instead
      </Link>
    </div>
  );
}
