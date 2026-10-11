"use client";

import { useState, useEffect } from "react";
import { Store, User, CreditCard, Bell } from "lucide-react";
import { Toast } from "../components/Toast";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Store Details");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your store preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-2">
          {[
            { icon: Store, label: "Store Details" },
            { icon: User, label: "Account" },
            { icon: CreditCard, label: "Billing" },
            { icon: Bell, label: "Notifications" },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                activeTab === item.label
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                  : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="col-span-1 md:col-span-3 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Store Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="Lumina Store"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@luminastore.com"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Store Description</label>
                <textarea 
                  rows={4}
                  defaultValue="Premium apparel and accessories."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setToastMessage("Settings saved successfully.")}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
