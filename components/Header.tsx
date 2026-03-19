'use client';

import { motion } from 'framer-motion';
import { MAX_SLOTS } from '@/lib/snacks';
import { MapPin, Box, ChevronRight } from 'lucide-react';

interface HeaderProps {
  filledSlots: number;
}

export function Header({ filledSlots }: HeaderProps) {
  const percentage = (filledSlots / MAX_SLOTS) * 100;
  const isFull = filledSlots === MAX_SLOTS;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFCFB]/90 backdrop-blur-lg border-b border-slate-100/80">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Identity - Optimized for Small Screens */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-orange p-2 rounded-xl shadow-lg shadow-orange/20 shrink-0">
              <Box className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight leading-none truncate">
                SNACK<span className="text-orange">BOX</span>
              </h1>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <MapPin size={10} className="text-orange shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  Mandalay
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section - Better Visual Weight on Mobile */}
          <div className="flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-xs flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                Capacity
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
            
            {/* Progress Bar Container */}
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className={`h-full rounded-full ${
                  isFull 
                    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
                    : 'bg-orange shadow-[0_0_12px_rgba(255,107,0,0.3)]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Status Banner */}
      <AnimatePresence mode="wait">
        {isFull ? (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-green-500 text-white text-[10px] sm:text-xs font-black py-1.5 text-center uppercase tracking-[0.15em] flex items-center justify-center gap-1"
          >
            Box Ready for Delivery <ChevronRight size={12} strokeWidth={3} />
          </motion.div>
        ) : filledSlots > (MAX_SLOTS * 0.7) ? (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-orange/10 text-orange text-[9px] font-bold py-1 text-center uppercase tracking-widest"
          >
            Almost there! Just {MAX_SLOTS - filledSlots} slots left
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

// Add this to your imports at the top
import { AnimatePresence } from 'framer-motion';