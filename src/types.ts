export type UserRole = 'admin' | 'customer' | 'driver';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  role: UserRole;
  password?: string; // Only for simulation purposes
  isVerified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  category: string;
}

export type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLocation: { lat: number; lng: number };
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  driverId?: string;
  driverName?: string;
  driverLocation?: { lat: number; lng: number };
  history?: { status: OrderStatus; timestamp: string }[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  timestamp: string;
}
