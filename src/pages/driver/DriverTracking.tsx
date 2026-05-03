import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation, MapPin, Phone, Package, CheckCircle2, ArrowLeft, Play, Pause } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Order, OrderStatus } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { LiveMap } from '../../components/MapComponents';
import { motion } from 'motion/react';

export default function DriverTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const o = dataService.getOrders().find(o => o.id === id);
      if (o) setOrder(o);
    }
  }, [id]);

  const updateStatus = (status: OrderStatus) => {
    if (order) {
      const updated = { ...order, status };
      dataService.updateOrder(updated);
      setOrder(updated);
    }
  };

  const startSimulation = () => {
    if (!order) return;
    setIsSimulating(true);
    updateStatus('Out for Delivery');

    let currentLat = order.driverLocation?.lat || -17.8248;
    let currentLng = order.driverLocation?.lng || 31.0530;
    const targetLat = order.customerLocation.lat;
    const targetLng = order.customerLocation.lng;

    simulationInterval.current = setInterval(() => {
      const latDiff = targetLat - currentLat;
      const lngDiff = targetLng - currentLng;
      const step = 0.0005;

      if (Math.abs(latDiff) < step && Math.abs(lngDiff) < step) {
        clearInterval(simulationInterval.current!);
        setIsSimulating(false);
        updateStatus('Delivered');
        return;
      }

      currentLat += Math.sign(latDiff) * step;
      currentLng += Math.sign(lngDiff) * step;

      const updatedOrder = {
        ...order,
        driverLocation: { lat: currentLat, lng: currentLng }
      };
      dataService.updateOrder(updatedOrder);
      setOrder(updatedOrder);
    }, 1000);
  };

  const stopSimulation = () => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);
    setIsSimulating(false);
  };

  useEffect(() => {
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, []);

  if (!order) return <div className="p-12 text-center font-bold text-gray-400">Order not found</div>;

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col md:flex-row">
      {/* Side Panel */}
      <div className="w-full md:w-96 bg-white shadow-xl overflow-y-auto z-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => navigate('/driver/deliveries')} className="p-2 text-gray-400 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Task</div>
             <h2 className="font-bold text-gray-900">{order.id}</h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
           {/* Actions */}
           <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Operations</div>
              <div className="space-y-3">
                 {order.status === 'Packed' && (
                   <button 
                    onClick={() => updateStatus('Out for Delivery')}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                   >
                     <Navigation className="w-5 h-5" /> Pick Up Order
                   </button>
                 )}
                 {order.status === 'Out for Delivery' && (
                   <div className="space-y-3">
                      <button 
                        onClick={isSimulating ? stopSimulation : startSimulation}
                        className={cn(
                          "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
                          isSimulating ? "bg-orange-100 text-orange-600 shadow-orange-200" : "bg-green-600 text-white shadow-green-200"
                        )}
                      >
                        {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isSimulating ? 'Stop Driving' : 'Start Driving'}
                      </button>
                      <button 
                        onClick={() => updateStatus('Delivered')}
                        className="w-full py-4 bg-white border-2 border-green-500 text-green-600 rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Complete Delivery
                      </button>
                   </div>
                 )}
                 {order.status === 'Delivered' && (
                    <div className="flex flex-col items-center gap-4 py-4">
                       <CheckCircle2 className="w-12 h-12 text-green-500" />
                       <div className="text-center">
                          <div className="font-bold text-gray-900 mb-1">Order Delivered</div>
                          <div className="text-sm text-gray-500">You've successfully delivered this order.</div>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Customer Info */}
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="bg-gray-100 p-3 rounded-2xl text-gray-500"><Navigation className="w-6 h-6" /></div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination</div>
                   <div className="text-sm font-bold text-gray-900 leading-relaxed">{order.customerAddress}</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="bg-gray-100 p-3 rounded-2xl text-gray-500"><Phone className="w-6 h-6" /></div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Details</div>
                   <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                   <div className="text-sm font-medium text-primary mt-1">{order.customerPhone}</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="bg-gray-100 p-3 rounded-2xl text-gray-500"><Package className="w-6 h-6" /></div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items to Deliver</div>
                   <div className="text-xs font-medium text-gray-600 mt-1">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                   </div>
                   <div className="text-sm font-black text-gray-900 mt-2">To Collect: {formatPrice(order.total)}</div>
                 </div>
              </div>
           </div>

           {isSimulating && (
             <div className="bg-primary p-4 rounded-2xl text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   <div className="text-xs font-bold uppercase tracking-widest">GPS Tracking Active</div>
                </div>
                <div className="text-xs opacity-80">Updating live...</div>
             </div>
           )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 bg-gray-50 relative">
         <LiveMap customerLocation={order.customerLocation} driverLocation={order.driverLocation} />
         
         <div className="absolute top-6 right-6 bg-white/90 backdrop-blur p-4 rounded-3xl shadow-xl border border-white z-20 hidden md:block">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-green-500" />
               <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Live Status: {order.status}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
