"use client";

import { useState, useEffect } from "react";
import { X, Plus, Save, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import { createProduct, updateProduct, ProductInput } from "@/app/actions/seller";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  inventory_count: number;
  image_url: string;
  description?: string;
  is_new?: boolean;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialProduct?: Product | null;
}

const PRESET_IMAGES = [
  { label: "White Tee", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
  { label: "Denim Jacket", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800" },
  { label: "Chino Pants", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800" },
  { label: "Knit Sweater", url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800" },
  { label: "Linen Shirt", url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800" },
  { label: "Beanie Hat", url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800" },
];

export function AddProductModal({ isOpen, onClose, onSave, initialProduct }: AddProductModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state with initialProduct when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setErrorMessage(null);
      if (initialProduct) {
        setName(initialProduct.name || "");
        setCategory(initialProduct.category || "Apparel");
        setPrice(String(initialProduct.price || ""));
        setCurrency(initialProduct.currency || "USD");
        setStock(String(initialProduct.inventory_count ?? "10"));
        setImageUrl(initialProduct.image_url || "");
        setDescription(initialProduct.description || "");
        setIsNew(initialProduct.is_new ?? false);
      } else {
        setName("");
        setCategory("Apparel");
        setPrice("");
        setCurrency("USD");
        setStock("10");
        setImageUrl(PRESET_IMAGES[0].url);
        setDescription("");
        setIsNew(false);
      }
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialProduct]);

  if (!mounted || (!isOpen && !isAnimating)) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a product name.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const payload: ProductInput = {
      name: name.trim(),
      category: category.trim(),
      price: numPrice,
      currency: currency || "USD",
      inventory_count: parseInt(stock, 10) || 0,
      image_url: imageUrl.trim() || PRESET_IMAGES[0].url,
      description: description.trim(),
      is_new: isNew,
    };

    try {
      if (initialProduct?.id) {
        const res = await updateProduct(initialProduct.id, payload);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update product.");
          setLoading(false);
          return;
        }
      } else {
        const res = await createProduct(payload);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create product.");
          setLoading(false);
          return;
        }
      }

      onSave();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {initialProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              {initialProduct 
                ? "Update product details. Changes will immediately sync to the storefront." 
                : "Fill in the details to publish a new product to your live store."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-bold">Error saving product</p>
              <p className="text-xs mt-0.5 text-red-600 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Product Title *
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Linen Overshirt"
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium cursor-pointer"
              >
                <option value="Apparel">Apparel</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Pants">Pants</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
                <option value="Sweatshirts">Sweatshirts</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Price ({currency}) *
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-semibold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Inventory Stock
              </label>
              <input 
                type="number" 
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Mark as New Badge */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-200 rounded-xl w-full cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Feature as "New Arrival"
                  </span>
                  <span className="text-gray-500 text-[11px] block mt-0.5">Displays a prominent badge on the store</span>
                </div>
              </label>
            </div>

            {/* Image URL Input & Presets */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Product Image URL
              </label>
              <div className="flex gap-3">
                <input 
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-xs"
                />
                {imageUrl && (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden border border-gray-200 shrink-0">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="48px" />
                  </div>
                )}
              </div>

              {/* Quick Preset Selector */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Or choose a preset preview image:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        imageUrl === preset.url
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Description
              </label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of materials, fit, care instructions..."
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : initialProduct ? (
                <>
                  <Save className="w-4 h-4" />
                  Update Product
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Publish Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
