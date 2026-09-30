"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export default function AccountClient({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(
    profile?.full_name || user.user_metadata?.full_name || ""
  );
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ── Save profile ──────────────────────────────────────────────── */

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("fullName", fullName);

    const result = await updateProfile(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      setMessage({ type: "success", text: result.success });
    }

    setSaving(false);
  }

  /* ── Sign out ──────────────────────────────────────────────────── */

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }, [supabase.auth, router]);

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--surface-200)]">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--brand-600)] text-white shadow-md transition-transform group-hover:scale-105">
              <span className="text-sm font-bold tracking-tight">L</span>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline">
              Lumina Apparel
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-[var(--brand-500)]/30 hover:text-[var(--brand-700)]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M5 12l6-6M5 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to shop
          </Link>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="animate-fade-in">
          {/* Page header */}
          <div className="mb-10">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              My Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your profile and account settings.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* ── Profile card ───────────────────────────────────── */}
            <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-[var(--shadow-card)] h-fit">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-700)] text-2xl font-bold text-white shadow-lg">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-emerald-500">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 4.2 4.2L19 6.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {displayName}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>
                <p className="mt-3 text-xs text-slate-400">
                  Member since {memberSince}
                </p>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[var(--surface-50)] p-3 text-center">
                  <p className="text-lg font-bold text-[var(--brand-600)]">0</p>
                  <p className="text-[11px] font-medium text-slate-500">Orders</p>
                </div>
                <div className="rounded-xl bg-[var(--surface-50)] p-3 text-center">
                  <p className="text-lg font-bold text-[var(--brand-600)]">0</p>
                  <p className="text-[11px] font-medium text-slate-500">Wishlist</p>
                </div>
              </div>
            </div>

            {/* ── Settings panels ─────────────────────────────── */}
            <div className="space-y-6">
              {/* Profile edit */}
              <div className="rounded-2xl border border-[var(--surface-200)] bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Profile Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update your personal details
                    </p>
                  </div>
                </div>

                {/* Status message */}
                {message && (
                  <div
                    className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-scale-in ${
                      message.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {message.type === "success" ? (
                        <path
                          d="m5 12 4.2 4.2L19 6.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                        </>
                      )}
                    </svg>
                    <span>{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label
                      htmlFor="account-fullname"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </label>
                    <input
                      id="account-fullname"
                      name="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-50)] px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="h-12 w-full rounded-xl border border-[var(--surface-200)] bg-[var(--surface-100)] px-4 text-sm text-slate-500 cursor-not-allowed"
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                      Contact support to change your email address.
                    </p>
                  </div>

                  <button
                    id="save-profile-button"
                    type="submit"
                    disabled={saving}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-600)] px-6 text-sm font-semibold text-white shadow-lg shadow-teal-800/20 transition-all hover:bg-[var(--brand-700)] hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {saving ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </form>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-200/60 bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Sign Out
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sign out of your account on this device
                    </p>
                  </div>
                </div>

                <button
                  id="account-sign-out"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-6 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] disabled:opacity-50"
                >
                  {signingOut ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing out…
                    </>
                  ) : (
                    "Sign out"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
