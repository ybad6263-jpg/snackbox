'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoxItem } from '@/lib/types';
import { MAX_SLOTS } from '@/lib/snacks';
import { Trash2, ShoppingBag } from 'lucide-react';

interface BoxGridProps {
  items: BoxItem[];
  onRemoveSnack: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function BoxGrid({ items, onRemoveSnack, onDragOver, onDrop }: BoxGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const filledSlots = items.reduce((sum, item) => sum + item.snack.size, 0);
  const remainingSlots = MAX_SLOTS - filledSlots;

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-4">
      {/* 1. Header: Clean & Informative */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Your Selection
          </h2>
          <p className="text-[10px] font-bold text-orange uppercase tracking-widest mt-1">
            {remainingSlots === 0 ? "Box is Full & Ready" : `Space for ${remainingSlots} more`}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Capacity</span>
          <div className="flex gap-0.5">
            {[...Array(MAX_SLOTS)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-3 rounded-full transition-colors ${i < filledSlots ? 'bg-orange' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. THE BOX (Fixed height, No Scroll) */}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="relative aspect-square w-full bg-[#F3EFE7] rounded-[2.5rem] border-[10px] border-white shadow-2xl overflow-hidden flex items-center justify-center p-4 sm:p-6"
      >
        {/* Subtle Cardboard Branding Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
          <h1 className="text-8xl font-black -rotate-12 scale-150">SNACKBOX</h1>
        </div>

        {/* 3. THE DENSE GRID */}
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center space-y-3"
          >
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm mx-auto flex items-center justify-center text-slate-200">
              <ShoppingBag size={32} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Start Packing Your Soul</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-3 gap-3 w-full h-full grid-flow-dense">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const itemKey = `${item.snackId}-${index}`;
                
                // Logic: Size 1 = 1x1, Size 2 = 2x1, Size 4 = 2x2
                const spanClass = 
                  item.snack.size === 1 ? 'col-span-1 row-span-1' : 
                  item.snack.size === 2 ? 'col-span-2 row-span-1' : 
                  'col-span-2 row-span-2';

                return (
                  <motion.div
                    key={itemKey}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className={`
                      ${spanClass} relative group bg-white rounded-2xl shadow-sm border border-slate-100 p-2 
                      flex flex-col items-center justify-center transition-all hover:shadow-md
                    `}
                  >
                    {/* Snack Content */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {!imageErrors[itemKey] && item.snack.image ? (
                        <img 
                          src={item.snack.image} 
                          alt={item.snack.name}
                          className="max-w-full max-h-full object-contain drop-shadow-sm"
                          onError={() => setImageErrors(prev => ({ ...prev, [itemKey]: true }))}
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl">{item.snack.icon}</span>
                      )}
                      
                      {/* Overlay Remove Button */}
                      <button
                        onClick={() => onRemoveSnack(index)}
                        className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center"
                      >
                        <div className="bg-white p-2 rounded-full shadow-lg text-red-500">
                          <Trash2 size={16} />
                        </div>
                      </button>
                    </div>

                    {/* Badge for Multi-slot items */}
                    {item.snack.size > 1 && (
                      <div className="absolute top-1 left-1 bg-slate-100 text-[8px] font-bold text-slate-400 px-1.5 rounded-md">
                        {item.snack.size}U
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 4. Bottom Trust Bar */}
      <div className="flex justify-center items-center gap-4 mt-2">
         <div className="h-[1px] flex-1 bg-slate-100" />
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">
           Crafted in Mandalay
         </p>
         <div className="h-[1px] flex-1 bg-slate-100" />
      </div>
    </div>
  );
}