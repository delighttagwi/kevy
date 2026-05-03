import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Navigation, Search, CheckCircle2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Order, User } from '../../types';
import { cn } from '../../lib/utils';

const driverIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [32, 32],
});

const customerIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [24, 24],
});

export default function AdminTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(dataService.getOrders().filter(o => o.status === 'Out for Delivery'));
      setDrivers(dataService.getUsers().filter(u => u.role === 'driver'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-48px)] flex">
      {/* Sidebar - Active Deliveries */}
      <div className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Fleet Tracking</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">{orders.length} Deliveries in Progress</p>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orders.map(order => (
               <div key={order.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                     <div className="text-sm font-bold text-gray-900">{order.id}</div>
                     <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-wider">Live</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Truck className="w-4 h-4" />
                     </div>
                     <div>
                        <div className="text-xs font-bold text-gray-900">{order.driverName}</div>
                        <div className="text-[10px] text-gray-400">Heading to {order.customerName}</div>
                     </div>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-primary rounded-full animate-progress" style={{ width: '60%' }} />
                  </div>
               </div>
            ))}
            {orders.length === 0 && (
               <div className="text-center py-20 text-gray-400">
                  <Navigation className="w-10 h-10 mx-auto mb-4 opacity-10" />
                  No live deliveries right now.
               </div>
            )}
         </div>
      </div>

      {/* Map View */}
      <div className="flex-1 bg-gray-50">
         <MapContainer center={[-17.8248, 31.0530]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {orders.map(order => (
               <React.Fragment key={order.id}>
                  {order.driverLocation && (
                     <Marker position={[order.driverLocation.lat, order.driverLocation.lng]} icon={driverIcon}>
                        <Popup>
                           <div className="font-bold">Driver: {order.driverName}</div>
                           <div className="text-xs">Delivering Order {order.id}</div>
                        </Popup>
                     </Marker>
                  )}
                  <Marker position={[order.customerLocation.lat, order.customerLocation.lng]} icon={customerIcon}>
                     <Popup>Customer: {order.customerName}</Popup>
                  </Marker>
               </React.Fragment>
            ))}
         </MapContainer>
      </div>
    </div>
  );
}
