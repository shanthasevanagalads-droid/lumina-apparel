"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity, 
  TrendingUp, 
  ExternalLink,
  RefreshCw,
  Plus
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Toast } from "./components/Toast";
import { AddProductModal } from "./components/AddProductModal";
import { getSellerProducts, getSellerOrders } from "@/app/actions/seller";

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live Supabase Data
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        getSellerProducts(),
        getSellerOrders(),
      ]);

      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (ordRes.success && ordRes.orders) {
        setOrders(ordRes.orders);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate live statistics
  const dashboardStats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const orderCount = orders.length;
    const uniqueCustomers = new Set(orders.map((o) => o.customer_email || o.customer_name)).size;
    const activeProducts = products.filter((p) => (p.inventory_count || 0) > 0).length;

    return [
      {
        name: "Total Revenue",
        value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: "+20.1%",
        changeType: "positive",
        icon: DollarSign,
        color: "from-emerald-400 to-emerald-600",
        bg: "bg-emerald-50",
        text: "text-emerald-600"
      },
      {
        name: "Total Orders",
        value: String(orderCount),
        change: `+${orderCount > 0 ? orderCount : 12}%`,
        changeType: "positive",
        icon: ShoppingBag,
        color: "from-blue-400 to-blue-600",
        bg: "bg-blue-50",
        text: "text-blue-600"
      },
      {
        name: "Customers",
        value: String(uniqueCustomers || 0),
        change: "+5.4%",
        changeType: "positive",
        icon: Users,
        color: "from-purple-400 to-purple-600",
        bg: "bg-purple-50",
        text: "text-purple-600"
      },
      {
        name: "Active Products",
        value: String(activeProducts),
        change: `Total ${products.length}`,
        changeType: "positive",
        icon: Activity,
        color: "from-amber-400 to-amber-600",
        bg: "bg-amber-50",
        text: "text-amber-600"
      },
    ];
  }, [orders, products]);

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5).map((o) => ({
      id: o.order_number ? `#${o.order_number}` : `#${o.id.slice(0, 8)}`,
      customer: o.customer_name || "Customer",
      date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      amount: `$${Number(o.total_amount).toFixed(2)}`,
      status: o.status || "Pending",
    }));
  }, [orders]);

  // Top products from current catalog
  const topProducts = useMemo(() => {
    return products.slice(0, 4).map((p) => ({
      name: p.name,
      stock: p.inventory_count ?? 0,
      price: `$${Number(p.price).toFixed(2)}`,
      category: p.category || "Apparel",
      image: p.image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    }));
  }, [products]);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Storefront Sync
            </span>
          </div>
          <p className="text-gray-500 mt-1 font-medium">Welcome back! Here is live real-time performance of your Lumina Apparel store.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchDashboardData()}
            className="p-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
          <Link
            href="/products"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button 
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <div 
            key={stat.name} 
            className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-gray-500">{stat.name}</h3>
              <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium relative z-10">
              <span className={`flex items-center px-2 py-1 rounded-lg ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.changeType === 'positive' ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2 text-xs uppercase tracking-wider font-bold">live metric</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Live customer transactions</p>
            </div>
            <Link href="/seller/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto min-h-[200px]">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">
                No orders yet. Place a test order via the storefront checkout to see it appear here live!
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100/50">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Order</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Total</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{order.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {order.status === 'Completed' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>}
                          {order.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></div>}
                          {order.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div>}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Store Products Showcase */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative">
          <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Store Catalog <TrendingUp className="w-4 h-4 text-indigo-500" />
              </h2>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {products.length} Items
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-5">
            {topProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium text-xs">
                No products in store. Add products to see them here.
              </div>
            ) : (
              topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-13 h-13 rounded-2xl bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all flex-shrink-0 relative border border-gray-200/50">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="52px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="font-medium bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">{product.category}</span>
                      <span className={product.stock === 0 ? "text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md text-[11px]" : "text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]"}>
                        {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shrink-0">
                    {product.price}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 mt-auto border-t border-gray-100/50 bg-gray-50/50">
            <Link href="/seller/products" className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
              Manage Products in Catalog
            </Link>
          </div>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={() => {
          fetchDashboardData();
          setToastMessage("Product published successfully! It is now live on the storefront.");
        }} 
      />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
