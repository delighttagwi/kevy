import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Plus, Star } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(dataService.getProducts());
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-12">
      {/* Search Bar - Duplicate functionality for Home if needed, though Layout has it */}
      
      {/* Hero Banner Section */}
      <section className="mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary rounded-3xl p-6 lg:px-10 lg:py-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight leading-tight">
              Welcome to <br />
              Diaper World Harare
            </h1>
            <p className="opacity-90 text-sm lg:text-base mb-6 leading-relaxed max-w-lg">
              Quality care for your little ones. Get essentials delivered in 60 minutes or less with our real-time delivery system.
            </p>
            <button 
              onClick={() => document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent text-accent-dark px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
            >
              START SHOPPING
            </button>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary-dark rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute right-12 top-4 w-32 h-32 bg-accent rounded-full opacity-20 blur-xl"></div>
        </motion.div>
      </section>

      {/* Main Feed */}
      <section id="shop-now">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Popular Today</h2>
          <div className="hidden sm:flex items-center gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                  selectedCategory === c 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group h-full"
            >
              <div>
                <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl aspect-[4/3] mb-4 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                   {/* Clean Placeholder Panel */}
                   <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-200" />
                   </div>
                   <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-black text-primary uppercase shadow-sm tracking-tighter">
                    {product.category}
                  </div>
                </Link>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-[11px] text-gray-400 mb-4 line-clamp-1">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold hover:bg-primary-dark shadow-md shadow-primary/20 transition-all active:scale-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800">No essentials found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Dummy helper for icon since Truck was used in Hero
import { Truck } from 'lucide-react';
