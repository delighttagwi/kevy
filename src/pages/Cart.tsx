import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-xs text-sm">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="btn-primary"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                   <div className="w-6 h-6 bg-white border border-gray-100 rounded shadow-sm flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3 text-gray-200" />
                   </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 px-2 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-lg font-black text-primary mt-1 mb-auto">{formatPrice(item.price)}</div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-all text-gray-500 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-all text-gray-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl sticky top-24">
            <h2 className="font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                <span>Subtotal ({itemCount})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                <span>Delivery</span>
                <span className={total >= 30 ? "text-green-600" : ""}>
                   {total >= 30 ? "FREE" : formatPrice(5)}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total >= 30 ? total : total + 5)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 text-base"
            >
              Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
