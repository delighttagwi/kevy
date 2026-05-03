import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, Package, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/deliveries');
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-2xl mb-6 border border-primary/10">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to Diaper World</h1>
            <p className="text-sm text-gray-400 mt-2">Enter your credentials to access your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold text-xs uppercase tracking-widest">
              <Info className="w-4 h-4" />
              <span>Demo Credentials</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setEmail('admin@gmail.com'); setPassword('12345678'); }}
                className="text-left p-3 rounded-xl bg-gray-50 hover:bg-accent/20 transition-colors border border-transparent hover:border-accent"
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase">Admin Portal</div>
                <div className="text-sm font-medium text-gray-700">admin@gmail.com / 12345678</div>
              </button>
              <button 
                onClick={() => { setEmail('driver1@gmail.com'); setPassword('12345678'); }}
                className="text-left p-3 rounded-xl bg-gray-50 hover:bg-accent/20 transition-colors border border-transparent hover:border-accent"
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase">Driver Portal</div>
                <div className="text-sm font-medium text-gray-700">driver1@gmail.com / 12345678</div>
              </button>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/" className="text-primary font-bold hover:underline">Start shopping as guest</Link>
        </p>
      </div>
    </div>
  );
}
