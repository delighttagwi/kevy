import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, ChevronRight, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Order } from '../types';
import { cn, formatPrice } from '../lib/utils';
import { LiveMap } from '../components/MapComponents';
import { motion } from 'motion/react';

const statuses = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = () => {
      if (id) {
        const o = dataService.getOrders().find(o => o.id === id);
        if (o) setOrder(o);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <div className="p-20 text-center">Order not found</div>;

  const currentStep = statuses.indexOf(order.status);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-6">
           <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded inline-block uppercase tracking-widest mb-2">Live Status</div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Order {order.id}</h1>
              <p className="text-gray-500 mt-1 font-medium">{order.items.length} items • {formatPrice(order.total)}</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</div>
                 <div className="text-xl font-black text-gray-900">{order.status === 'Delivered' ? 'Arrived' : '35 - 50 MIN'}</div>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-primary">
                 <Truck className="w-6 h-6" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Status Timeline */}
        <div className="lg:col-span-1 space-y-12">
           <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <h2 className="font-bold text-gray-900 mb-8">Delivery Progress</h2>
             <div className="space-y-10 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100" />
                {statuses.map((s, i) => (
                  <div key={s} className="relative flex items-start gap-6">
                     <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all",
                        i <= currentStep ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white border-2 border-gray-100 text-gray-300"
                     )}>
                        {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <div className="text-[10px] font-black">{i + 1}</div>}
                     </div>
                     <div className="flex-1 pt-1">
                        <div className={cn("text-sm font-bold", i <= currentStep ? "text-gray-900" : "text-gray-300")}>{s}</div>
                        {i === currentStep && i < 3 && (
                           <div className="text-xs text-primary font-medium mt-1 animate-pulse">In progress...</div>
                        )}
                        {i === currentStep && i === 3 && (
                           <div className="text-xs text-green-600 font-medium mt-1">Order successfully delivered!</div>
                        )}
                        {i === 2 && order.driverName && i <= currentStep && (
                           <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary border border-gray-100">
                                <Truck className="w-4 h-4" />
                              </div>
                              <div>
                                 <div className="text-[10px] font-bold text-gray-400 uppercase">Driver Assigned</div>
                                 <div className="text-xs font-bold text-gray-700">{order.driverName}</div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
           </section>

           <section className="bg-primary rounded-3xl p-8 text-white">
              <h2 className="font-bold mb-4">Support Contact</h2>
              <p className="text-sm text-white/70 mb-6">Need help with your order? Our Harare team is ready to assist.</p>
              <div className="space-y-3">
                 <a href="tel:+263775987957" className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm font-bold">+263 77 598 7957</span>
                 </a>
                 <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-bold">Harare, Zimbabwe</span>
                 </div>
              </div>
           </section>
        </div>

        {/* Live Map */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-4xl border border-gray-100 shadow-2xl overflow-hidden h-[600px] flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Real-time tracking active</span>
                 </div>
                 {order.status === 'Out for Delivery' && (
                    <div className="text-xs font-bold text-primary">Driver is on the way!</div>
                 )}
              </div>
              <div className="flex-1 relative">
                 <LiveMap customerLocation={order.customerLocation} driverLocation={order.driverLocation} />
                 
                 {/* Map Overlays */}
                 <div className="absolute bottom-6 left-6 right-6 z-[400] flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {order.status === 'Out for Delivery' && (
                       <div className="min-w-[200px] bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border border-white flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                             <Truck className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Driver Info</div>
                             <div className="text-sm font-bold text-gray-900">{order.driverName}</div>
                          </div>
                       </div>
                    )}
                    <div className="min-w-[200px] bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border border-white flex items-center gap-4">
                       <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                          <MapPin className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Delivery To</div>
                          <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.customerAddress}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
