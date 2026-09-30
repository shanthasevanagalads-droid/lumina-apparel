"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function UserNav() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Listen for auth state changes ─────────────────────────────── */

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Subscribe to auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  /* ── Close dropdown on outside click ───────────────────────────── */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Close dropdown on Escape key ──────────────────────────────── */

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [menuOpen]);

  /* ── Sign out handler ──────────────────────────────────────────── */

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    setMenuOpen(false);
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed", err);
      setSigningOut(false);
    }
  }, [supabase.auth, router]);

  /* ── Derived display values ────────────────────────────────────── */

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const email = user?.email ?? "";

  /* ── Loading skeleton ──────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--surface-200)]" />
    );
  }

  /* ── Signed out: show Sign In link ─────────────────────────────── */

  if (!user) {
    return (
      <Link
        href="/login"
        id="nav-sign-in"
        className="flex items-center gap-2 rounded-xl border border-[var(--surface-200)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-[var(--brand-500)]/30 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="4" />
          <path
            d="M5.5 21a6.5 6.5 0 0 1 13 0"
            strokeLinecap="round"
          />
        </svg>
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  /* ── Signed in: avatar + dropdown ──────────────────────────────── */

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar trigger */}
      <button
        id="user-menu-trigger"
        onClick={() => setMenuOpen(!menuOpen)}
        className="group flex items-center gap-2.5 rounded-xl border border-[var(--surface-200)] bg-white px-2 py-1.5 transition-all hover:border-[var(--brand-500)]/30 hover:shadow-sm sm:px-3"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        {/* Avatar circle */}
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-700)] text-xs font-bold text-white shadow-sm">
          {initials}
        </div>
        {/* Name (hidden on small screens) */}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-slate-800 max-w-[120px] truncate">
            {displayName}
          </p>
        </div>
        {/* Chevron */}
        <svg
          className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${
            menuOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-[var(--surface-200)] bg-white shadow-[var(--shadow-elevated)] transition-all duration-200 ${
          menuOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        role="menu"
      >
        {/* User info header */}
        <div className="border-b border-[var(--surface-100)] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-700)] text-sm font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-2">
          {/* Divider label */}
          <p className="mb-1 px-3 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-[var(--surface-50)]"
            role="menuitem"
          >
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
                strokeLinejoin="round"
              />
              <path d="M9 21V12h6v9" strokeLinejoin="round" />
            </svg>
            Home
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-[var(--surface-50)]"
            role="menuitem"
          >
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-[var(--surface-50)]"
            role="menuitem"
          >
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="12" cy="8" r="4" />
              <path
                d="M5.5 21a6.5 6.5 0 0 1 13 0"
                strokeLinecap="round"
              />
            </svg>
            My Account
          </Link>
        </div>

        {/* Sign out */}
        <div className="border-t border-[var(--surface-100)] p-2">
          <button
            id="sign-out-button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            role="menuitem"
          >
            {signingOut ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="16 17 21 12 16 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="21"
                  y1="12"
                  x2="9"
                  y2="12"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
