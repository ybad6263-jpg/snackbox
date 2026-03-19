'use client';

import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative p-8 bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"><X size={16} /></button>
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
          <h2 className="text-xl font-black text-slate-800 uppercase italic">Mingalarbar!</h2>
          <p className="text-xs text-slate-400 font-bold mt-2">Sign in with Google to finish your order.</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
          <span className="text-sm font-black text-slate-700 uppercase">Continue with Google</span>
        </button>
      </motion.div>
    </div>
  );
}