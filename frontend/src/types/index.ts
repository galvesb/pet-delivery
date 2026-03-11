export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  cover_index: number;
  cover_url: string;
  categories: string[];
  is_active: boolean;
  is_featured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bg_color: string;
  text_color: string;
  link_url: string;
  link_text: string;
  is_active: boolean;
  order: number;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  order: number;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface ApiError {
  detail: string | { message: string; products: string[] };
}
