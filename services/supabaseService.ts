import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, DbConfig, Category } from '../types';
import { sendSystemAlert } from './notificationService';

let supabase: SupabaseClient | null = null;

// --- ERROR MONITORING HELPER ---
const handleDbError = async (context: string, error: any) => {
  console.error(`DB Error in [${context}]:`, error);

  // Retrieve contact info saved in AdminSettings
  const contactInfoJson = localStorage.getItem('ADMIN_CONTACT_INFO');
  
  if (contactInfoJson) {
    try {
      const contact = JSON.parse(contactInfoJson);
      const time = new Date().toLocaleString();
      const message = `⚠️ ALERTA DE SISTEMA: Falha crítica detectada no banco de dados.\nContexto: ${context}\nErro: ${error.message || JSON.stringify(error)}\nData: ${time}`;

      // Notify Email if configured
      if (contact.notifyEmail && contact.email) {
        await sendSystemAlert({
          recipient: contact.email,
          message: message,
          type: 'email'
        });
      }

      // Notify WhatsApp if configured
      if (contact.notifyWhatsapp && contact.phone) {
        await sendSystemAlert({
          recipient: contact.phone,
          message: message,
          type: 'whatsapp'
        });
      }
    } catch (parseError) {
      console.error("Failed to parse admin contact info during error handling", parseError);
    }
  }
};

export const initSupabase = (config: DbConfig) => {
  if (config.url && config.key) {
    try {
      supabase = createClient(config.url, config.key);
      return true;
    } catch (e) {
      handleDbError('initSupabase', e);
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
    handleDbError('checkConnection', e);
    return false;
  }
};

// --- PRODUCTS ---

export const fetchProducts = async (): Promise<Product[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    handleDbError('fetchProducts', error);
    return [];
  }
  return data as Product[];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) {
    handleDbError('createProduct', error);
    return null;
  }
  return data as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) {
    handleDbError('updateProduct', error);
    return false;
  }
  return true;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    handleDbError('deleteProduct', error);
    return false;
  }
  return true;
};

// --- CATEGORIES ---

export const fetchCategories = async (): Promise<Category[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
  if (error) {
    handleDbError('fetchCategories', error);
    return [];
  }
  return data as Category[];
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('categories').insert([category]).select().single();
  if (error) {
    handleDbError('createCategory', error);
    return null;
  }
  return data as Category;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) {
    handleDbError('updateCategory', error);
    return false;
  }
  return true;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  if (!supabase) return false;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    handleDbError('deleteCategory', error);
    return false;
  }
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
    shipping_method: order.shipping_method,
    items: order.items
  }]);
  
  if (error) {
    handleDbError('createOrder', error);
    return false;
  }
  return true;
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) {
    handleDbError('fetchOrders', error);
    return [];
  }
  return data as Order[];
};