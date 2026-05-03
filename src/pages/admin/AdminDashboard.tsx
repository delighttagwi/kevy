import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Truck, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Plus,
  ArrowRight
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Order, Product, User } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);

  useEffect(() => {
    setOrders(dataService.getOrders());
    setProducts(dataService.getProducts());
    setDrivers(dataService.getUsers().filter(u => u.role === 'driver'));
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: 'Total Sales', value: formatPrice(totalSales), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+12%', positive: true },
    { label: 'Active Orders', value: pendingOrders, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/5', trend: '+2', positive: true },
    { label: 'Low Stock Items', value: lowStockProducts, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', trend: '-1', positive: false },
    { label: 'Team Active', value: drivers.length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Live', positive: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Snapshot</h1>
          <p className="text-gray-500 mt-1">Monitor your business performance and inventory.</p>
        </div>
        <div className="flex gap-3">
           <Link
            to="/admin/products"
            className="px-6 py-2.5 bg-white border border-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Package className="w-5 h-5 text-gray-400" />
            Inventory
          </Link>
          <button
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-all group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                stat.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(-5).reverse().map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-gray-900">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                          order.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                          order.status === 'Delivered' ? "bg-green-100 text-green-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium text-sm">
                        No orders placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Inventory Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {products.sort((a, b) => a.stock - b.stock).slice(0, 4).map(product => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{product.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", product.stock < 10 ? "bg-red-500" : "bg-primary")} 
                            style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }} 
                          />
                        </div>
                        <span className={cn("text-[10px] font-black w-8 text-right uppercase", product.stock < 10 ? "text-red-500 font-black px-1 py-0.5 rounded" : "text-gray-400")}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <Link to="/admin/products" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
                 View Full Inventory
                 <ArrowUpRight className="w-4 h-4" />
               </Link>
            </div>
          </div>

          {/* Quick Tracking Map Card */}
          <div className="bg-primary rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <Truck className="w-10 h-10 mb-4 opacity-50" />
              <h2 className="text-xl font-bold mb-2">Live Delivery Map</h2>
              <p className="text-primary-accent text-sm mb-6 opacity-80">Track your drivers and active deliveries in real-time across Harare.</p>
              <Link
                to="/admin/tracking"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl font-bold text-sm hover:bg-accent transition-all"
              >
                Open Live Tracker
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
