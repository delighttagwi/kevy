import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Package, AlertCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Product } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    setProducts(dataService.getProducts());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dataService.deleteProduct(id);
      setProducts(dataService.getProducts());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      dataService.saveProduct(editingProduct as Product);
      setProducts(dataService.getProducts());
      setEditingProduct(null);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Inventory</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Manage catalog essentials</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
           </div>
           <button 
            onClick={() => setEditingProduct({ id: Math.random().toString(36).substr(2, 9), name: '', price: 0, stock: 0, description: '', category: 'Diapers', images: [] })}
            className="px-6 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all text-sm"
           >
             <Plus className="w-4 h-4" /> Add New
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead>
             <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <img src={product.images[0]} alt="" className="hidden" />
                             <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shrink-0">
                                <Package className="w-3.5 h-3.5 text-gray-300" />
                             </div>
                         </div>
                         <div>
                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                            <div className="text-[10px] text-gray-400 max-w-[200px] truncate">{product.description}</div>
                         </div>
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-accent/20 text-primary text-[10px] font-black uppercase rounded-lg">
                        {product.category}
                      </span>
                   </td>
                   <td className="px-6 py-4 font-black text-gray-900">
                      {formatPrice(product.price)}
                   </td>
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={cn("w-2 h-2 rounded-full", product.stock < 10 ? "bg-red-500 animate-pulse" : "bg-green-500")} />
                         <span className={cn("font-bold text-sm", product.stock < 10 ? "text-red-600" : "text-gray-700")}>
                            {product.stock}
                         </span>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                         >
                            <Edit3 className="w-4 h-4" />
                         </button>
                         <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
               <form onSubmit={handleSave}>
                 <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="p-2 text-gray-400">×</button>
                 </div>
                 <div className="p-8 space-y-6">
                    <div className="space-y-4">
                       <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Product Name</label>
                         <input required value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Price ($)</label>
                            <input required type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Stock</label>
                            <input required type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
                          </div>
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Category</label>
                         <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none">
                            <option>Diapers</option>
                            <option>Baby Wipes</option>
                            <option>Pampers</option>
                            <option>Care Items</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Description</label>
                         <textarea required rows={3} value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none resize-none" />
                       </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg">Save Product</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
