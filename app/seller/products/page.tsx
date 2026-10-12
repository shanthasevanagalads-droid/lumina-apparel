"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, X, PackageX, Check, ChevronDown, ExternalLink, RefreshCw } from "lucide-react";
import { Toast } from "../components/Toast";
import { AddProductModal } from "../components/AddProductModal";
import { getSellerProducts, deleteProduct } from "@/app/actions/seller";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  inventory_count: number;
  image_url: string;
  description?: string;
  is_new?: boolean;
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Low Stock" | "Out of Stock">("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await getSellerProducts();
      if (res.success && res.products) {
        setProducts(res.products as Product[]);
      } else {
        setToastMessage("Failed to load products: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      setToastMessage("Error: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"? This will remove it from the storefront.`)) {
      return;
    }

    setDeletingId(product.id);
    try {
      const res = await deleteProduct(product.id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setToastMessage(`Product "${product.name}" removed from store.`);
      } else {
        setToastMessage("Failed to delete: " + res.error);
      }
    } catch (err: any) {
      setToastMessage("Error deleting product: " + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const status = product.inventory_count > 10 ? 'Active' : product.inventory_count > 0 ? 'Low Stock' : 'Out of Stock';
      
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      if (!matchesStatus) return false;

      if (!query) return true;
      return (
        product.name.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query)) ||
        product.id.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery, statusFilter]);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Products</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              {products.length} Items Live
            </span>
          </div>
          <p className="text-gray-500 mt-1 font-medium">
            Manage your store inventory and publish items directly to the public storefront.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row gap-4 justify-between bg-white/50">
          <div className="relative w-full max-w-sm group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchProducts()}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm"
              title="Refresh product list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            </button>

            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-medium ${
                  statusFilter !== "All" ? "border-indigo-500 text-indigo-600" : "border-gray-200 text-gray-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Status: {statusFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterMenu ? "rotate-180" : ""}`} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Filter by Stock
                  </div>
                  {(["All", "Active", "Low Stock", "Out of Stock"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setStatusFilter(filter);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        statusFilter === filter ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{filter}</span>
                      {statusFilter === filter && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[250px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Product</th>
                <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold tracking-wider">Price</th>
                <th className="px-6 py-4 font-bold tracking-wider">Stock</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                      Loading live products from Supabase...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                        <PackageX className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {searchQuery || statusFilter !== "All"
                          ? "Try adjusting your search query or status filter."
                          : "No products in store yet. Click 'Add Product' to publish your first item."}
                      </p>
                      {(searchQuery || statusFilter !== "All") ? (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("All");
                          }}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-colors"
                        >
                          Reset Filters
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setIsProductModalOpen(true);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm"
                        >
                          Add Product
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => {
                const status = product.inventory_count > 10 ? 'Active' : product.inventory_count > 0 ? 'Low Stock' : 'Out of Stock';
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency || 'USD' }).format(product.price);
                const isBeingDeleted = deletingId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded-xl bg-gray-100 overflow-hidden shadow-sm border border-gray-200/50 flex-shrink-0">
                          <Image 
                            src={product.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'} 
                            alt={product.name} 
                            fill 
                            className="object-cover" 
                            sizes="48px" 
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.is_new && (
                              <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-800 rounded font-extrabold uppercase">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]" title={product.id}>
                            ID: {product.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{product.category || 'Apparel'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formattedPrice}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700">{product.inventory_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isBeingDeleted}
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Delete Product"
                        >
                          {isBeingDeleted ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-gray-500 font-medium">
            {isLoading ? "Loading..." : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled={filteredProducts.length <= 10}>Next</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isProductModalOpen}
        initialProduct={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={() => {
          fetchProducts();
          setToastMessage(editingProduct ? "Product updated successfully!" : "Product published to store!");
        }}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
