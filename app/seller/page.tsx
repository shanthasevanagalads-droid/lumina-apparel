"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Toast } from "./components/Toast";
import { AddProductModal } from "./components/AddProductModal";

// Mock data
const stats = [
  { name: "Total Revenue", value: "$45,231.89", change: "+20.1%", changeType: "positive", icon: DollarSign, color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
  { name: "Total Orders", value: "356", change: "+12.5%", changeType: "positive", icon: ShoppingBag, color: "from-blue-400 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
  { name: "Customers", value: "2,450", change: "-2.4%", changeType: "negative", icon: Users, color: "from-purple-400 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
  { name: "Active Products", value: "124", change: "+14.2%", changeType: "positive", icon: Activity, color: "from-amber-400 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Liam Johnson", product: "Classic Linen Shirt", date: "Today, 10:42 AM", amount: "$85.00", status: "Completed" },
  { id: "#ORD-002", customer: "Olivia Smith", product: "Everyday Tote Bag", date: "Today, 09:15 AM", amount: "$120.00", status: "Processing" },
  { id: "#ORD-003", customer: "Noah Williams", product: "Premium Cotton Tee", date: "Yesterday, 04:30 PM", amount: "$45.00", status: "Completed" },
  { id: "#ORD-004", customer: "Emma Brown", product: "Linen Trousers", date: "Yesterday, 02:10 PM", amount: "$95.00", status: "Pending" },
  { id: "#ORD-005", customer: "Ava Jones", product: "Classic Linen Shirt", date: "Oct 7, 11:20 AM", amount: "$85.00", status: "Completed" },
];

const topProducts = [
  { name: "Classic Linen Shirt", sales: 124, revenue: "$10,540", stock: 45, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=100&h=100&fit=crop" },
  { name: "Everyday Tote Bag", sales: 98, revenue: "$11,760", stock: 12, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop" },
  { name: "Premium Cotton Tee", sales: 85, revenue: "$3,825", stock: 156, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
  { name: "Linen Trousers", sales: 64, revenue: "$6,080", stock: 0, image: "https://images.unsplash.com/photo-1594938298596-70f56fb3ca9b?w=100&h=100&fit=crop" },
];

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration mismatch with animations

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back! Here is what is happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setToastMessage("Report downloaded successfully.")}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Download Report
          </button>
          <button 
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={stat.name} 
            className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Subtle background glow */}
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
              <span className="text-gray-400 ml-2 text-xs uppercase tracking-wider font-bold">vs last month</span>
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
              <p className="text-sm text-gray-500 mt-1">Your latest 5 transactions</p>
            </div>
            <Link href="/seller/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100/50">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Order</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Product</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</span>
                      <div className="text-xs text-gray-400 mt-1">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.product}</td>
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
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative">
          <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Top Products <TrendingUp className="w-4 h-4 text-indigo-500" />
              </h2>
            </div>
            <button className="text-gray-400 hover:text-gray-700">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all flex-shrink-0 relative border border-gray-200/50">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                  <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                    <span className="font-medium bg-gray-100 px-2 py-0.5 rounded-md">{product.sales} sales</span>
                    <span className={product.stock === 0 ? "text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md" : "text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md"}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-extrabold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                  {product.revenue}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 mt-auto border-t border-gray-100/50 bg-gray-50/50">
            <Link href="/seller/products" className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2">
              View All Products <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={() => setToastMessage("Product added successfully!")} 
      />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
