'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_SLOTS } from '@/lib/snacks';
import { MapPin, Box, ChevronRight, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  filledSlots: number;
}

export function Header({ filledSlots }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const percentage = (filledSlots / MAX_SLOTS) * 100;
  const isFull = filledSlots === MAX_SLOTS;

  // 1. Monitor User Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.reload(); // Refresh to clear states
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFCFB]/90 backdrop-blur-lg border-b border-slate-100/80">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand & User Section */}
          <div className="flex items-center gap-3">
            {/* User Profile / Icon */}
            <div className="relative">
              <button 
                onClick={() => user && setShowUserMenu(!showUserMenu)}
                className="relative w-10 h-10 rounded-2xl bg-orange flex items-center justify-center shadow-lg shadow-orange/20 overflow-hidden group active:scale-95 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-black" size={18} />
                ) : user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Box className="text-black w-5 h-5" />
                )}
              </button>

              {/* Logout Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight leading-none truncate">
                SNACK<span className="text-orange">BOX</span>
              </h1>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <MapPin size={10} className="text-orange shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate italic">
                  Mandalay
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-xs flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic">
                {isFull ? 'Ready!' : 'Box Capacity'}
              </span>
              <motion.span 
                key={filledSlots}
                initial={{ scale: 1.2, color: "#FF6B00" }}
                animate={{ scale: 1, color: isFull ? "#22C55E" : "#1E293B" }}
                className="text-xs sm:text-sm font-black"
              >
                {filledSlots}/{MAX_SLOTS}
              </motion.span>
            </div>
            
            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-green-500' : 'bg-orange'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFull ? (
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="bg-green-500 text-white text-[10px] font-black py-1.5 text-center uppercase tracking-[0.15em] flex items-center justify-center gap-1"
          >
            Box Ready for Delivery <ChevronRight size={12} strokeWidth={3} />
          </motion.div>
        ) : filledSlots > (MAX_SLOTS * 0.7) ? (
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 'auto' }}
            className="bg-orange/10 text-orange text-[9px] font-bold py-1 text-center uppercase tracking-widest italic"
          >
            Almost there! Just {MAX_SLOTS - filledSlots} slots left
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}