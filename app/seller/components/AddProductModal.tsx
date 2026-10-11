"use client";

import { useState, useEffect } from "react";
import { X, Upload, Plus, Image as ImageIcon } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted || (!isOpen && !isAnimating)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-2xl p-4 sm:p-6 my-8 mx-auto transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Add New Product</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Fill in the details to add a new product to your store.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Classic Linen Shirt"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-700">
                  <option value="" disabled selected>Select Category</option>
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                  <option value="footwear">Footwear</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SKU (Optional)</label>
                <input 
                  type="text" 
                  placeholder="PROD-000"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <div className="flex text-sm text-gray-600 mt-4 justify-center">
                      <span className="relative cursor-pointer rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onSave();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Save Product
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
