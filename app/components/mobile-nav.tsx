"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-md active:bg-slate-100">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[var(--surface-200)] shadow-lg p-4 flex flex-col gap-2 z-50 animate-in slide-in-from-top-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-900 font-semibold px-4 py-3 hover:bg-[var(--surface-50)] rounded-lg">Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="text-slate-900 font-semibold px-4 py-3 hover:bg-[var(--surface-50)] rounded-lg">Shop</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-slate-900 font-semibold px-4 py-3 hover:bg-[var(--surface-50)] rounded-lg">Contact</Link>
        </div>
      )}
    </div>
  );
}
