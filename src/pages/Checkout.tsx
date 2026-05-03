import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Phone, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { formatPrice, cn } from '../lib/utils';
import { MapPicker } from '../components/MapComponents';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

type Step = 'details' | 'otp' | 'success';

export default function Checkout() {
  const { items, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || 'Media House 3rd Street, Harare',
    location: user?.location || { lat: -17.8248, lng: 31.0530 },
  });
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const deliveryFee = total >= 30 ? 0 : 5;
  const grandTotal = total + deliveryFee;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      const order: Order = {
        id: 'DW-' + Math.floor(100000 + Math.random() * 900000),
        customerId: user?.id || 'guest-' + Date.now(),
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerLocation: formData.location,
        items: [...items],
        total: grandTotal,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      
      dataService.createOrder(order);
      setCreatedOrder(order);
      clearCart();
      setIsVerifying(false);
      setStep('success');
    }, 1500);
  };

  if (itemCount === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12">
      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all", 
            step === 'details' ? "bg-primary text-white scale-110 shadow-lg" : "bg-green-500 text-white")}>
            {step === 'details' ? '1' : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div className="w-12 h-0.5 bg-gray-100" />
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all", 
            step === 'otp' ? "bg-primary text-white scale-110 shadow-lg" : (step === 'success' ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"))}>
            {step === 'otp' ? '2' : (step === 'success' ? <CheckCircle2 className="w-6 h-6" /> : '2')}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><Package className="w-6 h-6" /></div>
                  <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                </div>
                <form id="checkout-form" onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        placeholder="+263 77..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        placeholder="House No, Street, Suburb"
                      />
                    </div>
                  </div>
                </form>
              </section>

              <section>
                 <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><CreditCard className="w-6 h-6" /></div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Option</h2>
                </div>
                <div className="bg-accent/10 border border-accent rounded-3xl p-6 flex items-center gap-4">
                   <div className="bg-white p-3 rounded-2xl shadow-sm"><Package className="w-6 h-6 text-primary" /></div>
                   <div>
                     <div className="font-bold text-gray-900">Cash on Delivery</div>
                     <div className="text-xs text-gray-500 font-medium">Pay when your diapers arrive</div>
                   </div>
                   <CheckCircle2 className="w-6 h-6 text-primary ml-auto" />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-medium text-center italic">Online payment integration coming soon...</p>
              </section>
            </div>

            <div className="space-y-8">
               <section>
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin className="w-6 h-6" /></div>
                      <h2 className="text-xl font-bold text-gray-900">Select Location</h2>
                   </div>
                   <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded">Drop Pin</span>
                 </div>
                 <MapPicker 
                  onLocationSelect={(lat, lng) => setFormData({ ...formData, location: { lat, lng } })}
                  initialLocation={formData.location}
                 />
                 <p className="mt-2 text-xs text-center text-gray-400 font-medium italic">Help our drivers find you faster</p>
               </section>

               <section className="bg-gray-100 rounded-3xl p-8">
                 <h3 className="font-bold text-gray-900 mb-6">Order Summary</h3>
                 <div className="space-y-3 mb-8">
                    {items.map(i => (
                      <div key={i.productId} className="flex justify-between text-sm">
                        <span className="text-gray-500">{i.quantity}x {i.name}</span>
                        <span className="font-bold text-gray-700">{formatPrice(i.price * i.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm py-3 border-t border-gray-200 mt-4">
                      <span className="text-gray-500 font-medium">Delivery</span>
                      <span className={cn("font-bold", deliveryFee === 0 ? "text-green-600" : "text-gray-700")}>
                        {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-300">
                      <span>Total</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                 </div>
                 <button
                    form="checkout-form"
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group"
                  >
                    Confirm & Send OTP
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </section>
            </div>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification</h2>
            <p className="text-gray-500 mb-10 max-w-sm">
              We just sent a 4-digit code to <span className="font-bold text-gray-900">{formData.phone}</span>. Please enter it below to confirm your order.
            </p>
            
            <div className="flex gap-4 mb-10">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-48 text-center text-4xl font-black tracking-[0.5em] py-4 bg-white border-2 border-gray-100 rounded-3xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="0000"
              />
            </div>

            <button
               disabled={otp.length !== 4 || isVerifying}
               onClick={handleVerifyOTP}
               className="px-12 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-95 disabled:shadow-none"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Place My Order
                  <Package className="w-5 h-5" />
                </>
              )}
            </button>
            <button 
              onClick={() => setStep('details')}
              className="mt-6 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
            >
              Wait, I need to change something
            </button>
            <div className="mt-8 text-xs text-gray-400 font-medium">Demo Hint: Any 4 digits will work</div>
          </motion.div>
        )}

        {step === 'success' && createdOrder && (
           <motion.div
            key="success"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h2>
            <p className="text-lg text-gray-500 mb-2 font-medium">The diapers are on their way.</p>
            <div className="bg-gray-50 px-4 py-2 rounded-full text-xs font-black text-gray-400 tracking-widest uppercase mb-12">
              Order ID: {createdOrder.id}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-12">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 text-left">
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Truck className="w-6 h-6" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Delivery</div>
                    <div className="text-sm font-bold text-gray-900">In 35-50 minutes</div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 text-left">
                  <div className="bg-orange-50 p-2 rounded-xl text-orange-600"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</div>
                    <div className="text-sm font-bold text-gray-900">Preparing Order</div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => navigate(`/order/${createdOrder.id}`)}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                Track Live Order
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                Return to Shop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
