"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronDown, 
  Download, 
  X, 
  PackageX, 
  Check, 
  ArrowUpDown,
  Eye,
  RefreshCw
} from "lucide-react";
import { Toast } from "../components/Toast";
import { getSellerOrders, updateOrderStatus } from "@/app/actions/seller";

interface Order {
  id: string;
  dbId?: string;
  date: string;
  customer: string;
  email: string;
  items: number;
  total: string;
  status: "Completed" | "Processing" | "Pending" | "Cancelled";
}

const initialOrders: Order[] = [
  { id: "#ORD-9021", date: "Today, 10:42 AM", customer: "Liam Johnson", email: "liam@example.com", items: 3, total: "$125.00", status: "Completed" },
  { id: "#ORD-9020", date: "Today, 09:15 AM", customer: "Olivia Smith", email: "olivia@example.com", items: 1, total: "$120.00", status: "Processing" },
  { id: "#ORD-9019", date: "Yesterday, 04:30 PM", customer: "Noah Williams", email: "noah@example.com", items: 2, total: "$95.00", status: "Completed" },
  { id: "#ORD-9018", date: "Yesterday, 02:10 PM", customer: "Emma Brown", email: "emma@example.com", items: 1, total: "$45.00", status: "Pending" },
  { id: "#ORD-9017", date: "Oct 7, 11:20 AM", customer: "Ava Jones", email: "ava@example.com", items: 4, total: "$210.00", status: "Cancelled" },
  { id: "#ORD-9016", date: "Oct 7, 09:45 AM", customer: "William Davis", email: "will@example.com", items: 1, total: "$85.00", status: "Completed" },
];

const TABS = ["All Orders", "Pending", "Processing", "Completed", "Cancelled"] as const;
type TabType = (typeof TABS)[number];

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<TabType>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeManageOrderId, setActiveManageOrderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "price-high" | "price-low" | "items-high">("default");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsRefreshing(true);
    try {
      const res = await getSellerOrders();
      if (res.success && res.orders && res.orders.length > 0) {
        const mapped: Order[] = res.orders.map((o: any) => ({
          id: o.order_number ? `#${o.order_number}` : `#ORD-${o.id.slice(0, 4)}`,
          dbId: o.id,
          date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          customer: o.customer_name || "Customer",
          email: o.customer_email || "customer@example.com",
          items: o.items_count || 1,
          total: `$${Number(o.total_amount).toFixed(2)}`,
          status: (o.status || "Pending") as Order["status"],
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error("fetchOrders notice:", err);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(e.target as Node)) {
        setActiveManageOrderId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate count for each tab button
  const tabCounts = useMemo(() => {
    return {
      "All Orders": orders.length,
      "Pending": orders.filter((o) => o.status === "Pending").length,
      "Processing": orders.filter((o) => o.status === "Processing").length,
      "Completed": orders.filter((o) => o.status === "Completed").length,
      "Cancelled": orders.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

  // Filtered and sorted orders based on active tab, search query, and sort option
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders
      .filter((order) => {
        // Tab filtering
        const matchesTab = activeTab === "All Orders" || order.status === activeTab;
        if (!matchesTab) return false;

        // Search filtering
        if (!query) return true;
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.total.toLowerCase().includes(query) ||
          order.status.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-high") {
          const priceA = parseFloat(a.total.replace(/[^0-9.-]+/g, ""));
          const priceB = parseFloat(b.total.replace(/[^0-9.-]+/g, ""));
          return priceB - priceA;
        }
        if (sortBy === "price-low") {
          const priceA = parseFloat(a.total.replace(/[^0-9.-]+/g, ""));
          const priceB = parseFloat(b.total.replace(/[^0-9.-]+/g, ""));
          return priceA - priceB;
        }
        if (sortBy === "items-high") {
          return b.items - a.items;
        }
        return 0;
      });
  }, [orders, activeTab, searchQuery, sortBy]);

  // Status update handler
  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    setActiveManageOrderId(null);
    setToastMessage(`Order ${orderId} status changed to ${newStatus}`);

    if (targetOrder?.dbId) {
      await updateOrderStatus(targetOrder.dbId, newStatus);
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      setToastMessage("No orders available to export.");
      return;
    }
    const headers = ["Order ID,Date,Customer,Email,Items,Total,Status"];
    const rows = filteredOrders.map(
      (o) => `"${o.id}","${o.date}","${o.customer}","${o.email}",${o.items},"${o.total}","${o.status}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumina_orders_${activeTab.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Exported ${filteredOrders.length} orders as CSV.`);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and fulfill your live customer orders.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchOrders()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const count = tabCounts[tab];
          const isActive = activeTab === tab;
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                isActive 
                  ? "bg-indigo-500/80 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row gap-4 justify-between bg-white/50">
          <div className="relative w-full max-w-sm group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer, email..." 
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 relative" ref={filterMenuRef}>
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-4 py-2.5 bg-white border font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm ${
                sortBy !== "default" ? "border-indigo-500 text-indigo-600" : "border-gray-200 text-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters {sortBy !== "default" && "•"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Filter / Sort Dropdown */}
            {showFilterMenu && (
              <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sort Orders
                </div>
                {[
                  { key: "default", label: "Default (Newest)" },
                  { key: "price-high", label: "Total (High to Low)" },
                  { key: "price-low", label: "Total (Low to High)" },
                  { key: "items-high", label: "Items (Most First)" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key as any);
                      setShowFilterMenu(false);
                      setToastMessage(`Sorted by: ${opt.label}`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      sortBy === opt.key ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.key && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
                
                {sortBy !== "default" && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSortBy("default");
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                    >
                      Reset sorting
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto min-h-[300px]">
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                        <PackageX className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">No orders found</h3>
                      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                        {searchQuery 
                          ? `No orders matching "${searchQuery}" in ${activeTab.toLowerCase()}.` 
                          : `There are currently no orders with the "${activeTab}" status.`}
                      </p>
                      {(searchQuery || activeTab !== "All Orders") && (
                        <button
                          onClick={() => {
                            setActiveTab("All Orders");
                            setSearchQuery("");
                          }}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          View All Orders
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrderDetails(order)}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{order.customer}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{order.items} {order.items === 1 ? 'item' : 'items'}</td>
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
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left" ref={activeManageOrderId === order.id ? manageMenuRef : undefined}>
                        <button 
                          onClick={() => setActiveManageOrderId(activeManageOrderId === order.id ? null : order.id)}
                          className="px-3 py-1.5 text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100"
                        >
                          Manage <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Status change dropdown */}
                        {activeManageOrderId === order.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Update Status
                            </div>
                            {(["Pending", "Processing", "Completed", "Cancelled"] as Order["status"][]).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(order.id, status)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                                  order.status === status
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span>{status}</span>
                                {order.status === status && <Check className="w-3.5 h-3.5" />}
                              </button>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-100">
                              <button
                                onClick={() => {
                                  setSelectedOrderDetails(order);
                                  setActiveManageOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Results Count */}
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-gray-500 font-medium">
            {filteredOrders.length === 0 ? (
              "Showing 0 results"
            ) : (
              `Showing 1 to ${filteredOrders.length} of ${filteredOrders.length} ${filteredOrders.length === 1 ? 'order' : 'orders'}${activeTab !== 'All Orders' ? ` in ${activeTab}` : ''}`
            )}
            {orders.length > filteredOrders.length && ` (filtered from ${orders.length} total)`}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled={filteredOrders.length <= 6}>Next</button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Order Details</span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{selectedOrderDetails.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Customer Name</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.customer}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Email</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.email}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Date & Time</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.date}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Items</span>
                  <span className="font-bold text-gray-900">{selectedOrderDetails.items} units</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Total Amount</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{selectedOrderDetails.total}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Change Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Pending", "Processing", "Completed", "Cancelled"] as Order["status"][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        handleUpdateStatus(selectedOrderDetails.id, st);
                        setSelectedOrderDetails({ ...selectedOrderDetails, status: st });
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedOrderDetails.status === st
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
