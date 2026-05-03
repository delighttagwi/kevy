import { User, Product, Order, CartItem, OrderStatus } from '../types';

const USERS_KEY = 'dw_users';
const PRODUCTS_KEY = 'dw_products';
const ORDERS_KEY = 'dw_orders';
const CURRENT_USER_KEY = 'dw_current_user';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Comfort Fabric Conditioner 800ml',
    price: 4.00,
    stock: 50,
    description: 'Concentrated fabric conditioner for long-lasting freshness and softness.',
    category: 'Home Care',
    images: ['https://shoprite.azureedge.net/content/images/thumbs/001/0014798_comfort-fabric-conditioner-pure-800ml.jpeg', 'https://m.media-amazon.com/images/I/71X8X8-G9rL._AC_SL1500_.jpg'],
  },
  {
    id: '2',
    name: 'Huggies Extra Care Size 1',
    price: 15.50,
    stock: 35,
    description: 'Ultra soft, hypoallergenic diapers for newborns.',
    category: 'Diapers',
    images: ['https://m.media-amazon.com/images/I/71X8X8-G9rL._AC_SL1500_.jpg', 'https://shoprite.azureedge.net/content/images/thumbs/001/0014798_comfort-fabric-conditioner-pure-800ml.jpeg'],
  },
  {
    id: '3',
    name: 'Pampers Baby Dry Size 3',
    price: 22.00,
    stock: 25,
    description: 'Up to 12 hours of protection and dryness.',
    category: 'Pampers',
    images: ['https://m.media-amazon.com/images/I/71R3A6W0n9L._AC_SL1500_.jpg', 'https://shoprite.azureedge.net/content/images/thumbs/001/0014798_comfort-fabric-conditioner-pure-800ml.jpeg'],
  },
  {
    id: '4',
    name: 'Johnson Baby Wipes (Pack of 3)',
    price: 8.99,
    stock: 100,
    description: 'Alcohol-free wipes for sensitive skin.',
    category: 'Baby Wipes',
    images: ['https://m.media-amazon.com/images/I/81U2fH6XlPL._AC_SL1500_.jpg', 'https://shoprite.azureedge.net/content/images/thumbs/001/0014798_comfort-fabric-conditioner-pure-800ml.jpeg'],
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DW1001',
    customerId: 'cust-1',
    customerName: 'Tinashe M.',
    customerPhone: '+263 77 111 2222',
    customerAddress: '123 Samora Machel Ave, Harare',
    customerLocation: { lat: -17.8248, lng: 31.0530 },
    items: [{ 
      productId: '1', 
      name: 'Comfort Fabric Conditioner', 
      price: 4.0, 
      quantity: 2,
      image: 'https://shoprite.azureedge.net/content/images/thumbs/001/0014798_comfort-fabric-conditioner-pure-800ml.jpeg' 
    }],
    total: 8.0,
    status: 'Packed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    driverId: 'driver-1',
    history: [{ status: 'Pending', timestamp: new Date(Date.now() - 7200000).toISOString() }]
  },
  {
    id: 'DW1003',
    customerId: 'cust-3',
    customerName: 'Amai S.',
    customerPhone: '+263 77 555 6666',
    customerAddress: '88 Enterprise Rd, Harare',
    customerLocation: { lat: -17.8000, lng: 31.0800 },
    items: [{ 
      productId: '3', 
      name: 'Pampers Baby Dry', 
      price: 22.0, 
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/71R3A6W0n9L._AC_SL1500_.jpg' 
    }],
    total: 22.0,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    driverId: 'driver-1',
    history: [{ status: 'Pending', timestamp: new Date(Date.now() - 3600000).toISOString() }]
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@gmail.com',
    name: 'DW Admin',
    role: 'admin',
    password: '12345678',
    isVerified: true,
  },
  {
    id: 'driver-1',
    email: 'driver1@gmail.com',
    name: 'John Driver',
    role: 'driver',
    password: '12345678',
    isVerified: true,
    location: { lat: -17.8248, lng: 31.0530 },
  },
  {
    id: 'driver-2',
    email: 'driver2@gmail.com',
    name: 'Sarah Driver',
    role: 'driver',
    password: '12345678',
    isVerified: true,
    location: { lat: -17.8300, lng: 31.0450 },
  },
];

class DataService {
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Initialization
  init() {
    if (!localStorage.getItem(PRODUCTS_KEY)) {
      this.set(PRODUCTS_KEY, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(USERS_KEY)) {
      this.set(USERS_KEY, INITIAL_USERS);
    }
    if (!localStorage.getItem(ORDERS_KEY)) {
      this.set(ORDERS_KEY, INITIAL_ORDERS);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.get(PRODUCTS_KEY);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(product: Product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.set(PRODUCTS_KEY, products);
  }

  deleteProduct(id: string) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.set(PRODUCTS_KEY, products);
  }

  // Users & Auth
  getUsers(): User[] {
    return this.get(USERS_KEY);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  login(email: string, password: string): User | null {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  register(userData: Partial<User>): User {
    const users = this.getUsers();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email!,
      role: userData.role || 'customer',
      password: userData.password,
      isVerified: false,
      ...userData,
    };
    users.push(newUser);
    this.set(USERS_KEY, users);
    return newUser;
  }

  updateUser(user: User) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
      this.set(USERS_KEY, users);
      // If updating current user, sync localStorage
      const current = this.getCurrentUser();
      if (current && current.id === user.id) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }
    }
  }

  // Orders
  getOrders(): Order[] {
    return this.get(ORDERS_KEY);
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.getOrders().filter(o => o.customerId === userId || o.driverId === userId);
  }

  createOrder(order: Order) {
    const orders = this.getOrders();
    orders.push(order);
    this.set(ORDERS_KEY, orders);
    
    // Update stock levels
    const products = this.getProducts();
    order.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) p.stock -= item.quantity;
    });
    this.set(PRODUCTS_KEY, products);
  }

  updateOrder(order: Order) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      this.set(ORDERS_KEY, orders);
    }
  }
}

export const dataService = new DataService();
