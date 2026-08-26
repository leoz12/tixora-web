// Shared TypeScript interfaces mirroring the backend API JSON response structure.

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at?: string; // ISO 8601
  total_orders?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string; // ISO 8601
  location: string;
  image_url: string;
  price: number; // in Rupiah
  admin_fee: number; // flat platform fee per order, in Rupiah
  total_tickets: number;
  available_tickets: number;
  category_id: string;
  category: Category;
}

export interface Order {
  order_id: string;
  event_id: string;
  event_title: string;
  event_image: string;
  quantity: number;
  total_price: number;
  status: "pending" | "paid" | "expired" | "cancelled";
  ticket_reference: string;
  purchased_at: string; // ISO 8601
  // Detail-only fields, present on GET /orders/:id
  event_date?: string; // ISO 8601
  event_location?: string;
  unit_price?: number;
  admin_fee?: number;
  buyer_name?: string;
  buyer_email?: string;
  payment_method?: string;
  payment_url?: string;
  snap_token?: string;
  expires_at?: string; // ISO 8601
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

// Generic API response wrapper: { data: T, pagination?: Pagination }
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}
