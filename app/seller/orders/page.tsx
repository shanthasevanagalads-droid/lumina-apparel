"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle2, Clock, XCircle, ChevronDown } from "lucide-react";
import { Toast } from "../components/Toast";

const orders = [
  { id: "#ORD-9021", date: "Today, 10:42 AM", customer: "Liam Johnson", email: "liam@example.com", items: 3, total: "$125.00", status: "Completed" },
  { id: "#ORD-9020", date: "Today, 09:15 AM", customer: "Olivia Smith", email: "olivia@example.com", items: 1, total: "$120.00", status: "Processing" },
  { id: "#ORD-9019", date: "Yesterday, 04:30 PM", customer: "Noah Williams", email: "noah@example.com", items: 2, total: "$95.00", status: "Completed" },
  { id: "#ORD-9018", date: "Yesterday, 02:10 PM", customer: "Emma Brown", email: "emma@example.com", items: 1, total: "$45.00", status: "Pending" },
  { id: "#ORD-9017", date: "Oct 7, 11:20 AM", customer: "Ava Jones", email: "ava@example.com", items: 4, total: "$210.00", status: "Cancelled" },
  { id: "#ORD-9016", date: "Oct 7, 09:45 AM", customer: "William Davis", email: "will@example.com", items: 1, total: "$85.00", status: "Completed" },
];

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and fulfill your customer orders.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setToastMessage("Exporting CSV...")}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {["All Orders", "Pending", "Processing", "Completed", "Cancelled"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row gap-4 justify-between bg-white/50">
          <div className="relative w-full max-w-sm group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setToastMessage("Filters dialog opened.")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold tracking-wider">Items</th>
                <th className="px-6 py-4 font-bold tracking-wider">Total</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700">{order.customer}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">{order.items} items</td>
                  <td className="px-6 py-4 font-extrabold text-gray-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {order.status === 'Processing' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                      {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {order.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setToastMessage("Manage options opened."); }}
                      className="px-3 py-1.5 text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      Manage <ChevronDown className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Showing 1 to 6 of 356 results</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
      
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
