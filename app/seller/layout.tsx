"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Store,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/seller", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/seller/products", icon: Package, label: "Products" },
    { href: "/seller/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/seller/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-gray-900 font-sans selection:bg-indigo-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-[8px_0_30px_rgba(0,0,0,0.03)]
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-20 flex items-center px-8 border-b border-gray-100/50">
          <Link href="/seller" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-gray-900 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2 rounded-xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-indigo-500/30">
              <Store className="w-5 h-5" />
            </div>
            Lumina
          </Link>
          <button 
            className="ml-auto md:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Overview</p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? "text-indigo-700 bg-indigo-50/50 font-semibold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8">Configuration</p>
          <Link 
            href="/seller/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              pathname === "/seller/settings" 
                ? "text-indigo-700 bg-indigo-50/50 font-semibold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
            }`}
          >
            <Settings className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-45 ${pathname === "/seller/settings" ? "text-indigo-600" : "text-gray-400"}`} />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-5 text-white relative overflow-hidden shadow-xl shadow-gray-900/20 group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h4 className="font-semibold text-sm">Lumina Pro</h4>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Unlock advanced analytics and priority support.</p>
              <button className="w-full py-2.5 bg-white text-black hover:bg-gray-100 transition-colors rounded-xl text-xs font-bold shadow-md">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-100/50 flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="p-2 md:hidden text-gray-600 hover:bg-white rounded-xl shadow-sm border border-gray-100 transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-full max-w-md hidden sm:block group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-full text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200/60 hover:border-gray-300 transition-all rounded-full shadow-sm hover:shadow">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200/60 mx-1"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <p className="font-semibold text-gray-900 text-sm leading-none group-hover:text-indigo-600 transition-colors">Seller Account</p>
                <p className="text-gray-500 text-xs mt-1">Lumina Store</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-all border-2 border-white">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-10 z-0">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
