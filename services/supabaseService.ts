import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, DbConfig, Category } from '../types';

let supabase: SupabaseClient | null = null;

export const initSupabase = (config: DbConfig) => {
  if (config.url && config.key) {
    try {
      supabase = createClient(config.url, config.key);
      return true;
    } catch (e) {
      console.error("Supabase init error:", e);
      return false;
    }
  }
  return false;
};

export const checkConnection = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("Connection check failed:", e);
    return false;
  }
};

// --- PRODUCTS ---

export const fetchProducts = async (): Promise<Product[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Fetch products error:", error);
    return [];
  }
  return data as Product[];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) {
    console.error("Create product error:", error);
    return null;
  }
  return data as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) {
    console.error("Update product error:", error);
    return false;
  }
  return true;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return false;
  return true;
};

// --- CATEGORIES ---

export const fetchCategories = async (): Promise<Category[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
  if (error) {
    console.error("Fetch categories error:", error);
    return [];
  }
  return data as Category[];
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('categories').insert([category]).select().single();
  if (error) {
    console.error("Create category error:", error);
    return null;
  }
  return data as Category;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) return false;
  return true;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return false;
  return true;
};

// --- ORDERS ---

export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('orders').insert([{
    customer_name: order.customer_name,
    total: order.total,
    status: order.status,
    tracking_code: order.tracking_code,
    items: order.items
  }]);
  
  if (error) {
    console.error("Create order error:", error);
    return false;
  }
  return true;
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data as Order[];
};