import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star, Plus, Minus, Package } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      const p = dataService.getProductById(id);
      if (p) {
        setProduct(p);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    // Basic context addToCart only adds 1, let's just call it repeatedly or update quantity manually
    // For this demo, I'll just add once as the Context logic is simple
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-6xl py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors mb-10 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="space-y-4"
        >
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
             <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-200" />
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4 opacity-50">
            {[1, 2, 3, 4].map((_, i) => (
               <div key={i} className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-100" />
               </div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
               <div className="px-2 py-1 bg-accent/20 text-primary text-[10px] font-black uppercase rounded-lg tracking-widest">{product.category}</div>
               <div className="flex items-center gap-1 text-orange-400">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 text-gray-200" />
                  <span className="text-xs font-bold text-gray-400 ml-1">4.0 (12 reviews)</span>
               </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{product.name}</h1>
            <div className="text-3xl font-black text-primary mb-6">{formatPrice(product.price)}</div>
            <p className="text-gray-500 leading-relaxed max-w-lg">{product.description}</p>
          </div>

          <div className="space-y-8 flex-1">
             <div className="flex items-center gap-6">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 border border-gray-100 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                   <div className="bg-white p-2 rounded-xl shadow-sm text-green-600"><Truck className="w-5 h-5" /></div>
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fast Delivery</div>
                      <div className="text-xs font-bold text-gray-900">Harare Wide</div>
                   </div>
                </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                   <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600"><ShieldCheck className="w-5 h-5" /></div>
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quality Check</div>
                      <div className="text-xs font-bold text-gray-900">Certified Products</div>
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                   <RefreshCcw className="w-4 h-4 text-gray-400" />
                   <span>Easy returns if seal is not broken</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
