'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingActionButtonProps {
  totalPrice: string;
  itemCount: number;
  onClick: () => void;
}

export function FloatingActionButton({
  totalPrice,
  itemCount,
  onClick,
}: FloatingActionButtonProps) {
  const isVisible = itemCount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[45] p-4 md:bottom-8 md:right-8 md:left-auto md:p-0"
        >
          {/* MOBILE: Full width bar at the bottom 
            DESKTOP: Floating pill on the right
          */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl md:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 group relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={22} className="text-orange" />
                <motion.span 
                  key={itemCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-black text-white border-2 border-slate-900"
                >
                  {itemCount}
                </motion.span>
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Review Box
                </span>
                <span className="text-xl font-bold tracking-tight">
                  ${totalPrice}
                </span>
              </div>
            </div>

            {/* Mobile-only CTA Arrow */}
            <div className="flex items-center gap-2 md:hidden bg-orange/10 text-orange px-3 py-2 rounded-xl">
              <span className="text-[10px] font-black uppercase tracking-tighter">Checkout</span>
              <ArrowRight size={14} />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}