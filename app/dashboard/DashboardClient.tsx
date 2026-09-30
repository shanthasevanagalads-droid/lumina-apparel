"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// IMPORTANT: Adjust this interface to match your actual database columns
interface Item {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  user_id: string;
}

export default function DashboardClient({
  initialItems,
  user
}: {
  initialItems: any[];
  user: User;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Create form state
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Edit form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("1");

  const TABLE_NAME = "cart_items";

  // Sync items when initialItems prop changes (from router.refresh)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Set up real-time listener for updates across tabs or windows
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLE_NAME,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [payload.new as Item, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) => prev.map((item) => item.id === payload.new.id ? (payload.new as Item) : item));
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!productId.trim()) return;
    setLoading(true);
    setErrorMsg("");

    const parsedQuantity = parseInt(quantity, 10) || 1;
    if (parsedQuantity < 1) {
      setErrorMsg("Quantity must be at least 1");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert([{ product_id: productId, quantity: parsedQuantity, user_id: user.id }]);

      if (error) {
        setErrorMsg("Failed to create item: " + error.message);
      } else {
        setProductId("");
        setQuantity("1");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Failed to create item: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editProductId.trim()) return;
    setLoading(true);
    setErrorMsg("");

    const parsedQuantity = parseInt(editQuantity, 10) || 1;
    if (parsedQuantity < 1) {
      setErrorMsg("Quantity must be at least 1");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ product_id: editProductId, quantity: parsedQuantity })
        .eq("id", editingId);

      if (error) {
        setErrorMsg("Failed to update item: " + error.message);
      } else {
        setEditingId(null);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Failed to update item: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this?")) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("id", id);

      if (error) {
        setErrorMsg("Failed to delete item: " + error.message);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Failed to delete item: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* CREATE Section */}
      <section className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add to Cart</h2>
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product ID</label>
              <input
                type="text"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder="e.g. prod_123"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder="1"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-semibold shadow-md flex items-center justify-center min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : "Create Record"}
          </button>
        </form>
      </section>

      {/* READ/DISPLAY Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Items</h2>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
            Total: {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No items yet</h3>
            <p className="text-gray-500">Get started by creating a new item above.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col group transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                {editingId === item.id ? (
                  /* UPDATE Form */
                  <form onSubmit={handleUpdate} className="flex-1 space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        value={editProductId}
                        onChange={(e) => setEditProductId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                        placeholder="Product ID"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="text-xs font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-xs font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* DISPLAY Item */
                  <>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 truncate pr-4 text-lg" title={item.product_id || "Unknown Product"}>
                          Product: {item.product_id || "Unknown Product"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-4">Quantity: {item.quantity}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>

                      {/* ACTIONS */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditProductId(item.product_id || "");
                            setEditQuantity(String(item.quantity || 1));
                          }}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition tooltip-trigger"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition tooltip-trigger"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
