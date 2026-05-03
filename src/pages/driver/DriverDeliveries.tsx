import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, MapPin, Package, CheckCircle2, ChevronRight, Navigation, Clock } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderStatus } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function DriverDeliveries() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setOrders(dataService.getOrders().filter(o => o.driverId === user.id));
    }
  }, [user]);

  const activeDeliveries = orders.filter(o => ['Packed', 'Out for Delivery'].includes(o.status));
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="mx-auto max-w-2xl px-4 lg:px-8 py-8">
       <div className="bg-primary rounded-3xl p-8 text-white mb-10 overflow-hidden relative shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">Hello, Driver!</h1>
            <p className="text-white/80 text-sm">You have {activeDeliveries.length} active deliveries to handle today.</p>
          </div>
          <Truck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
       </div>

       <div className="space-y-8">
          <section>
             <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" /> Active Tasks
             </h2>
             <div className="space-y-4">
                {activeDeliveries.map(order => (
                  <Link
                    key={order.id}
                    to={`/driver/deliveries/${order.id}`}
                    className="block bg-white p-6 rounded-3xl border border-gray-100 hover:border-primary shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</div>
                          <h3 className="font-bold text-gray-900 text-lg">{order.id}</h3>
                       </div>
                       <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          order.status === 'Packed' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                       )}>
                          {order.status}
                       </span>
                    </div>
                    <div className="space-y-3 pb-4 border-b border-gray-50 mb-4">
                       <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-300 mt-1" />
                          <div className="text-sm font-medium text-gray-600 leading-relaxed">{order.customerAddress}</div>
                       </div>
                       <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-300" />
                          <div className="text-sm font-medium text-gray-600">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="text-sm font-black text-gray-900">{formatPrice(order.total)}</div>
                       <div className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Start Delivery <ChevronRight className="w-4 h-4" />
                       </div>
                    </div>
                  </Link>
                ))}
                {activeDeliveries.length === 0 && (
                   <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 font-medium">
                      No active deliveries assigned.
                   </div>
                )}
             </div>
          </section>

          <section>
             <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Completed
             </h2>
             <div className="space-y-3">
                {completedDeliveries.map(order => (
                   <div key={order.id} className="bg-white px-6 py-4 rounded-2xl border border-gray-50 flex items-center justify-between opacity-70">
                      <div>
                         <div className="text-sm font-bold text-gray-900">{order.id}</div>
                         <div className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-gray-900">{formatPrice(order.total)}</div>
                         <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Delivered</div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );
}
