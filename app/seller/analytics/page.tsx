"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, BarChart3, TrendingUp, DollarSign, Download, Calendar } from "lucide-react";
import { Toast } from "../components/Toast";

type AnalyticsPeriod = "Weekly" | "Monthly" | "Yearly";

interface PeriodData {
  revenue: string;
  growth: string;
  growthPositive: boolean;
  yLabels: string[];
  bars: { label: string; height: number }[];
  stats: { title: string; value: string; trend: string; positive: boolean }[];
}

const analyticsData: Record<AnalyticsPeriod, PeriodData> = {
  Weekly: {
    revenue: "$11,840.50",
    growth: "14.8%",
    growthPositive: true,
    yLabels: ["$15k", "$11.2k", "$7.5k", "$3.7k", "$0"],
    bars: [
      { label: "Mon", height: 55 },
      { label: "Tue", height: 70 },
      { label: "Wed", height: 45 },
      { label: "Thu", height: 85 },
      { label: "Fri", height: 95 },
      { label: "Sat", height: 100 },
      { label: "Sun", height: 60 },
    ],
    stats: [
      { title: "Average Order Value", value: "$132.00", trend: "+8.1%", positive: true },
      { title: "Conversion Rate", value: "3.85%", trend: "+2.4%", positive: true },
      { title: "Store Visits", value: "8,920", trend: "+12.1%", positive: true },
    ],
  },
  Monthly: {
    revenue: "$45,231.89",
    growth: "20.1%",
    growthPositive: true,
    yLabels: ["$50k", "$37.5k", "$25k", "$12.5k", "$0"],
    bars: [
      { label: "Jan", height: 40 },
      { label: "Feb", height: 25 },
      { label: "Mar", height: 60 },
      { label: "Apr", height: 45 },
      { label: "May", height: 80 },
      { label: "Jun", height: 55 },
      { label: "Jul", height: 90 },
      { label: "Aug", height: 70 },
      { label: "Sep", height: 85 },
      { label: "Oct", height: 45 },
      { label: "Nov", height: 65 },
      { label: "Dec", height: 100 },
    ],
    stats: [
      { title: "Average Order Value", value: "$124.50", trend: "+5.2%", positive: true },
      { title: "Conversion Rate", value: "3.24%", trend: "+1.1%", positive: true },
      { title: "Store Visits", value: "45,231", trend: "-2.4%", positive: false },
    ],
  },
  Yearly: {
    revenue: "$489,120.00",
    growth: "32.4%",
    growthPositive: true,
    yLabels: ["$600k", "$450k", "$300k", "$150k", "$0"],
    bars: [
      { label: "2021", height: 35 },
      { label: "2022", height: 52 },
      { label: "2023", height: 68 },
      { label: "2024", height: 84 },
      { label: "2025", height: 100 },
    ],
    stats: [
      { title: "Average Order Value", value: "$118.90", trend: "+14.3%", positive: true },
      { title: "Conversion Rate", value: "3.10%", trend: "+0.8%", positive: true },
      { title: "Store Visits", value: "542,100", trend: "+28.7%", positive: true },
    ],
  },
};

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalyticsPeriod>("Monthly");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentData = analyticsData[activeTab];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Detailed breakdown of your store&apos;s performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setToastMessage("Date range: " + activeTab)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            {activeTab === "Weekly" ? "Last 7 Days" : activeTab === "Monthly" ? "Last 30 Days" : "Last 12 Months"}
          </button>
          <button 
            onClick={() => setToastMessage(`Exported ${activeTab.toLowerCase()} analytics report.`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Overview ({activeTab})</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">{currentData.revenue}</span>
              <span className={`flex items-center px-2 py-1 rounded-lg text-sm font-bold ${
                currentData.growthPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {currentData.growthPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {currentData.growth}
              </span>
            </div>
          </div>
          <div className="flex bg-gray-100/80 p-1 rounded-xl">
            {(["Weekly", "Monthly", "Yearly"] as AnalyticsPeriod[]).map((tab) => (
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
            {currentData.yLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between z-0">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-200/60 border-dashed border-t"></div>
            ))}
          </div>

          <div className="ml-12 flex items-end gap-2 sm:gap-6 w-full justify-between h-full pb-6 z-10">
            {currentData.bars.map((bar, i) => (
              <div key={bar.label + i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-indigo-100/70 rounded-t-lg relative overflow-hidden group-hover:bg-indigo-200 transition-colors" style={{ height: '100%' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-700 group-hover:from-indigo-500 group-hover:to-purple-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    style={{ height: `${bar.height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.stats.map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {i === 0 ? <DollarSign className="w-6 h-6" /> : i === 1 ? <TrendingUp className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
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
