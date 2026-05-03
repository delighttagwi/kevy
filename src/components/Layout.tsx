import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package, Truck, LayoutDashboard, Search, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden h-screen">
      {/* Main Header */}
      <header className="h-10 border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 bg-white shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-black text-primary tracking-tighter">DIAPER WORLD</span>
          </Link>
          <div className="hidden xl:flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 text-[9px] text-gray-400 font-medium">
            <MapPin className="w-2.5 h-2.5 text-primary" />
            Harare
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex relative items-center px-2 py-1 bg-gray-100 rounded-lg w-48 transition-all focus-within:ring-1 ring-primary/20">
            <Search className="w-3 h-3 text-gray-400 mr-1.5" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent text-[10px] text-gray-600 outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="hidden sm:block text-primary font-black text-[9px] uppercase tracking-widest hover:opacity-80 transition-opacity">
                ADM
              </Link>
            )}
            
            <Link to="/cart" className="relative p-1 text-gray-400 hover:text-primary transition-colors">
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-primary text-[9px] font-bold border border-primary/10">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:opacity-80"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-16 bg-white border-b border-gray-100 shadow-xl lg:hidden overflow-hidden z-40"
            >
              <nav className="flex flex-col p-4 gap-2">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Home</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 text-primary font-bold">Admin Dashboard</Link>
                )}
                {user?.role === 'driver' && (
                  <Link to="/driver/deliveries" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Driver Portal</Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium text-left"
                >
                  Logout
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop Sidebar */}
        <aside className="hidden lg:flex w-40 bg-white border-r border-gray-100 p-3 flex-col gap-5 shrink-0 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 px-2">Navigation</p>
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px] font-medium",
                location.pathname === '/' ? "text-primary font-bold bg-primary-light" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Package className="w-3.5 h-3.5" /> Home
            </Link>
            <Link
              to="/cart"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px] font-medium",
                location.pathname === '/cart' ? "text-primary font-bold bg-primary-light" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Cart
            </Link>
            {user?.role === 'driver' && (
              <Link
                to="/driver/deliveries"
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px] font-medium",
                  location.pathname.startsWith('/driver') ? "text-primary font-bold bg-primary-light" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Truck className="w-3.5 h-3.5" /> Truck
              </Link>
            )}
          </nav>

          <nav className="flex flex-col gap-1">
            <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 px-2">Catalog</p>
            <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all group">
              <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-white shrink-0">👶</span> 
              <span>Diapers</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all group">
              <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-white shrink-0">🧻</span> 
              <span>Wipes</span>
            </button>
          </nav>

          <div className="mt-auto p-2 bg-accent-light rounded-lg border border-accent/20">
            <p className="text-[8px] text-accent-dark/80 leading-tight font-black uppercase">
              60m Harare
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="p-4 lg:p-8 max-w-[1536px] mx-auto"
              >
                {children}
            </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-2 shrink-0">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-md p-0.5">
                <Package className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] font-black tracking-tighter text-primary">DW HARARE</span>
            </div>
            
            <div className="flex gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest items-center">
               <Link to="/" className="hover:text-primary transition-colors">Store</Link>
               <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
               <span className="text-gray-500">+263 77 598 7957</span>
            </div>

            <div className="text-[9px] text-gray-400 font-medium opacity-50">
              &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
