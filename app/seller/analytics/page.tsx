"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, BarChart3, TrendingUp, DollarSign, Download, Calendar } from "lucide-react";
import { Toast } from "../components/Toast";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Monthly");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Detailed breakdown of your store&apos;s performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setToastMessage("Date range picker opened.")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button 
            onClick={() => setToastMessage("Exporting data...")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-extrabold tracking-tight">$45,231.89</span>
              <span className="flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                20.1%
              </span>
            </div>
          </div>
          <div className="flex bg-gray-100/80 p-1 rounded-xl mt-4 sm:mt-0">
            {["Weekly", "Monthly", "Yearly"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Mock Chart */}
        <div className="h-64 mt-8 flex items-end gap-2 sm:gap-4 relative z-10 w-full justify-between px-2">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-bold text-gray-400 py-2">
            <span>$50k</span>
            <span>$37.5k</span>
            <span>$25k</span>
            <span>$12.5k</span>
            <span>$0</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between z-0">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-200/60 border-dashed border-t"></div>
            ))}
          </div>

          <div className="ml-12 flex items-end gap-2 sm:gap-6 w-full justify-between h-full pb-6 z-10">
            {[40, 25, 60, 45, 80, 55, 90, 70, 85, 45, 65, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-indigo-100 rounded-t-lg relative overflow-hidden group-hover:bg-indigo-200 transition-colors" style={{ height: '100%' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-1000 group-hover:from-indigo-500 group-hover:to-purple-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Average Order Value", value: "$124.50", icon: DollarSign, trend: "+5.2%", positive: true },
          { title: "Conversion Rate", value: "3.24%", icon: TrendingUp, trend: "+1.1%", positive: true },
          { title: "Store Visits", value: "45,231", icon: BarChart3, trend: "-2.4%", positive: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 font-semibold">{stat.title}</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
