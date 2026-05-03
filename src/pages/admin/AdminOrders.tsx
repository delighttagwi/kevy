import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, CheckCircle2, User, Clock, Search, Filter } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Order, User as UserType, OrderStatus } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<UserType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(dataService.getOrders());
    setDrivers(dataService.getUsers().filter(u => u.role === 'driver'));
  };

  const handleAssignDriver = (orderId: string, driver: UserType) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder: Order = {
        ...order,
        driverId: driver.id,
        driverName: driver.name,
        driverLocation: driver.location,
        status: 'Packed'
      };
      dataService.updateOrder(updatedOrder);
      refreshData();
      setIsAssignModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      dataService.updateOrder({ ...order, status });
      refreshData();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1">Assign drivers and update delivery statuses.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Driver</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice().reverse().map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{order.id}</div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm font-black text-primary mt-2">{formatPrice(order.total)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{order.customerPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group inline-block">
                       <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5",
                          order.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                          order.status === 'Packed' ? "bg-blue-100 text-blue-600" :
                          order.status === 'Out for Delivery' ? "bg-purple-100 text-purple-600" :
                          order.status === 'Delivered' ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-500"
                        )}>
                          {order.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />}
                          {order.status}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.driverId ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                           <Truck className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{order.driverName}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsAssignModalOpen(true); }}
                        className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/5 rounded-lg hover:bg-primary/10 transition-all uppercase tracking-wider"
                      >
                        Assign Driver
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      value={order.status}
                      className="text-xs font-bold text-gray-500 bg-gray-50 border border-transparent rounded-lg px-2 py-1 focus:outline-none hover:border-gray-200 transition-all cursor-pointer"
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="Packed">Set Packed</option>
                      <option value="Out for Delivery">Set Out for Delivery</option>
                      <option value="Delivered">Set Delivered</option>
                      <option value="Cancelled">Set Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                 <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Driver Modal */}
      <AnimatePresence>
        {isAssignModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary/5">
                <div>
                   <h3 className="font-bold text-gray-900">Assign Driver</h3>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Order {selectedOrder.id}</p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">×</button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                 {drivers.map(driver => (
                   <button
                    key={driver.id}
                    onClick={() => handleAssignDriver(selectedOrder.id, driver)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group text-left"
                   >
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors">
                        <User className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-gray-900">{driver.name}</div>
                        <div className="text-xs text-gray-400">Harare Central • Active</div>
                     </div>
                     <Truck className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                   </button>
                 ))}
                 {drivers.length === 0 && (
                   <div className="text-center py-8 text-gray-400 text-sm">No active drivers available.</div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
