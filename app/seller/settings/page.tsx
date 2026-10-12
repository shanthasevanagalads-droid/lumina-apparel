"use client";

import { useState, useEffect } from "react";
import { Store, User, CreditCard, Bell } from "lucide-react";
import { Toast } from "../components/Toast";

type SettingsTab = "Store Details" | "Account" | "Billing" | "Notifications";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("Store Details");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Store Details State
  const [storeName, setStoreName] = useState("Lumina Store");
  const [supportEmail, setSupportEmail] = useState("support@luminastore.com");
  const [storeDesc, setStoreDesc] = useState("Premium everyday apparel, minimalist fashion and essentials.");

  // Account Profile State
  const [firstName, setFirstName] = useState("Seller");
  const [lastName, setLastName] = useState("Admin");
  const [accountEmail, setAccountEmail] = useState("seller@luminastore.com");

  // Notifications settings state
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyStock, setNotifyStock] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load persisted settings
    const saved = localStorage.getItem("lumina_seller_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.supportEmail) setSupportEmail(parsed.supportEmail);
        if (parsed.storeDesc) setStoreDesc(parsed.storeDesc);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.accountEmail) setAccountEmail(parsed.accountEmail);
        if (parsed.notifyOrders !== undefined) setNotifyOrders(parsed.notifyOrders);
        if (parsed.notifyStock !== undefined) setNotifyStock(parsed.notifyStock);
        if (parsed.notifyMarketing !== undefined) setNotifyMarketing(parsed.notifyMarketing);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const saveSettings = () => {
    const data = {
      storeName,
      supportEmail,
      storeDesc,
      firstName,
      lastName,
      accountEmail,
      notifyOrders,
      notifyStock,
      notifyMarketing,
    };
    localStorage.setItem("lumina_seller_settings", JSON.stringify(data));
    setToastMessage("Settings saved successfully.");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your store configuration, brand details, and seller preferences.</p>
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
              onClick={() => setActiveTab(item.label as SettingsTab)}
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
            {activeTab === "Store Details" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Store Information</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Description</label>
                  <textarea
                    rows={4}
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Account" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Email</label>
                  <input
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                    Store Owner / Administrator
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                  >
                    Update Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Billing" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription & Payouts</h2>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Current Plan</span>
                    <h3 className="text-2xl font-extrabold mt-0.5">Lumina Merchant Pro</h3>
                    <p className="text-xs text-indigo-100 mt-1">$29/month • Active</p>
                  </div>
                  <button
                    onClick={() => setToastMessage("Plan management opened.")}
                    className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                  >
                    Manage Plan
                  </button>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                      STRIPE
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Connected Payout Account</h4>
                      <p className="text-xs text-gray-500">Stripe Express • Deposits sent daily</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Active
                  </span>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-gray-900">New Order Alerts</p>
                      <p className="text-xs text-gray-500">Receive instant notifications when customers place an order</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyOrders}
                      onChange={(e) => setNotifyOrders(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-gray-900">Low Stock Warnings</p>
                      <p className="text-xs text-gray-500">Get notified when product inventory drops below 5 units</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyStock}
                      onChange={(e) => setNotifyStock(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-gray-900">Marketing & Promotional Tips</p>
                      <p className="text-xs text-gray-500">Weekly tips and best practices for growing your sales</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyMarketing}
                      onChange={(e) => setNotifyMarketing(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
