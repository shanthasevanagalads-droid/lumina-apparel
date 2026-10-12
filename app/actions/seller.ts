"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProductInput {
  id?: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category?: string;
  inventory_count: number;
  image_url?: string;
  is_new?: boolean;
}

/**
 * Create a new product in the store
 */
export async function createProduct(input: ProductInput) {
  try {
    const supabase = await createClient();

    if (!input.name || !input.name.trim()) {
      return { success: false, error: "Product name is required." };
    }

    if (input.price < 0 || isNaN(input.price)) {
      return { success: false, error: "Please enter a valid price." };
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: input.name.trim(),
          description: input.description?.trim() || "",
          price: Number(input.price),
          currency: input.currency || "USD",
          category: input.category || "Apparel",
          inventory_count: Math.max(0, parseInt(String(input.inventory_count || 0), 10)),
          image_url: input.image_url?.trim() || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
          is_new: input.is_new ?? false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("createProduct error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/products");
    revalidatePath("/seller/products");
    revalidatePath("/seller");
    return { success: true, product: data };
  } catch (err: any) {
    console.error("createProduct exception:", err);
    return { success: false, error: err.message || "Failed to create product" };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, input: Partial<ProductInput>) {
  try {
    const supabase = await createClient();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.description !== undefined) updateData.description = input.description.trim();
    if (input.price !== undefined) updateData.price = Number(input.price);
    if (input.currency !== undefined) updateData.currency = input.currency;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.inventory_count !== undefined) updateData.inventory_count = Math.max(0, parseInt(String(input.inventory_count), 10));
    if (input.image_url !== undefined) updateData.image_url = input.image_url.trim();
    if (input.is_new !== undefined) updateData.is_new = input.is_new;

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("updateProduct error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/products");
    revalidatePath("/seller/products");
    revalidatePath("/seller");
    return { success: true, product: data };
  } catch (err: any) {
    console.error("updateProduct exception:", err);
    return { success: false, error: err.message || "Failed to update product" };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteProduct error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/products");
    revalidatePath("/seller/products");
    revalidatePath("/seller");
    return { success: true };
  } catch (err: any) {
    console.error("deleteProduct exception:", err);
    return { success: false, error: err.message || "Failed to delete product" };
  }
}

/**
 * Get all products for seller management
 */
export async function getSellerProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, products: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message, products: [] };
  }
}

/**
 * Get all orders for seller management
 */
export async function getSellerOrders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, orders: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message, orders: [] };
  }
}

/**
 * Update order fulfillment status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("updateOrderStatus error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/seller/orders");
    revalidatePath("/seller");
    return { success: true, order: data };
  } catch (err: any) {
    console.error("updateOrderStatus exception:", err);
    return { success: false, error: err.message || "Failed to update order status" };
  }
}

/**
 * Create a new customer order (called during checkout)
 */
export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  total_amount: number;
  currency?: string;
  items_count: number;
  payment_method?: string;
  shipping_address?: any;
  items?: Array<{
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
}) {
  try {
    const supabase = await createClient();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${randomSuffix}`;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          total_amount: orderData.total_amount,
          currency: orderData.currency || "USD",
          status: "Pending",
          items_count: orderData.items_count,
          payment_method: orderData.payment_method || "card",
          shipping_address: orderData.shipping_address || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderErr) {
      console.error("createOrder error:", orderErr);
      return { success: false, error: orderErr.message };
    }

    // Insert items if table exists and items provided
    if (order && orderData.items && orderData.items.length > 0) {
      const itemsPayload = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: String(item.product_id),
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url || "",
      }));

      await supabase.from("order_items").insert(itemsPayload).select();
    }

    revalidatePath("/seller/orders");
    revalidatePath("/seller");
    return { success: true, order };
  } catch (err: any) {
    console.error("createOrder exception:", err);
    return { success: false, error: err.message || "Failed to create order" };
  }
}
