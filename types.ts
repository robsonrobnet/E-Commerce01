export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  images?: string[]; // Array for carousel
  featured: boolean;
  created_at?: string;
  details?: {
    long_description?: string;
    benefits?: { title: string; desc: string }[];
    specs?: { label: string; value: string }[];
  };
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  tracking_code?: string;
  created_at: string;
  items: CartItem[];
}

export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

export interface DbConfig {
  url: string;
  key: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'instagram' | 'email' | 'whatsapp';
  status: 'active' | 'draft' | 'completed';
  ai_generated: boolean;
}

export enum Page {
  STORE = 'STORE',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS', // New Page for SEO focused product view
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_PRODUCTS = 'ADMIN_PRODUCTS',
  ADMIN_CATEGORIES = 'ADMIN_CATEGORIES',
  ADMIN_ORDERS = 'ADMIN_ORDERS',
  ADMIN_PAYMENTS = 'ADMIN_PAYMENTS',
  ADMIN_BANNERS = 'ADMIN_BANNERS',
  ADMIN_INTEGRATIONS = 'ADMIN_INTEGRATIONS',
  ADMIN_MARKETING = 'ADMIN_MARKETING', 
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  LOGIN = 'LOGIN'
}