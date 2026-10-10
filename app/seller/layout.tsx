import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Store
} from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/seller" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            Lumina Seller
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/seller" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900">
            <LayoutDashboard className="w-5 h-5 text-gray-500" />
            Dashboard
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Package className="w-5 h-5 text-gray-400" />
            Products
          </Link>
          <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            Orders
          </Link>
          <Link href="/seller/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Analytics
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Link href="/seller/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <Link href="/seller" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
            <Store className="w-3 h-3" />
          </div>
          Seller
        </Link>
        <button className="text-gray-500 hover:text-gray-900">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
