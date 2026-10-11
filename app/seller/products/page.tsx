"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Toast } from "../components/Toast";
import { AddProductModal } from "../components/AddProductModal";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  inventory_count: number;
  image_url: string;
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setToastMessage("Failed to load products: " + error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      setToastMessage("An unexpected error occurred: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your store products and inventory.</p>
        </div>
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row gap-4 justify-between bg-white/50">
          <div className="relative w-full max-w-sm group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Add a product to get started.
                  </td>
                </tr>
              ) : products.map((product) => {
                const status = product.inventory_count > 10 ? 'Active' : product.inventory_count > 0 ? 'Low Stock' : 'Out of Stock';
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency || 'USD' }).format(product.price);

                return (
                  <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded-xl bg-gray-100 overflow-hidden shadow-sm border border-gray-200/50 flex-shrink-0">
                          <Image src={product.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'} alt={product.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[120px]" title={product.id}>{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{product.category || 'Uncategorized'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formattedPrice}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700">{product.inventory_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setToastMessage("Edit product clicked."); }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setToastMessage("Delete product clicked."); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            {isLoading ? "Loading..." : `Showing ${products.length} results`}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Next</button>
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
