'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SNACKS } from '@/lib/snacks';
import { Snack } from '@/lib/types';
import { ChevronDown, Search, Plus, Sparkles } from 'lucide-react';

interface SnackMenuProps {
  onAddSnack: (snackId: string) => boolean;
  canAddSnack: (snackId: string) => boolean;
  remainingSlots: number;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORIES = [
  { id: 'sweet', label: 'Sweet Treats', emoji: '🍰' },
  { id: 'savory', label: 'Salty & Savory', emoji: '🥨' },
  { id: 'drinks', label: 'Cold Drinks', emoji: '🥤' },
] as const;

export function SnackMenu({
  onAddSnack,
  canAddSnack,
  remainingSlots,
  isOpen,
  onToggle,
}: SnackMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['sweet', 'savory']));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    expandedCategories.has(categoryId) ? newExpanded.delete(categoryId) : newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  return (
    <>
      {/* 1. Mobile "Trigger" Bar (Replaces the circular floating button) */}
      {!isOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent"
        >
          <button
            onClick={onToggle}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <Plus size={20} className="text-orange" />
            <span className="font-black uppercase tracking-widest text-sm">Add More Snacks</span>
            <span className="bg-orange/20 text-orange px-2 py-0.5 rounded-lg text-[10px]">{remainingSlots} Left</span>
          </button>
        </motion.div>
      )}

      {/* 2. Backdrop Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* 3. The Menu Drawer */}
      <motion.div
        initial={false}
        animate={{ 
          y: isOpen ? 0 : '100%',
          display: 'block' 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed inset-x-0 bottom-0 z-50 bg-[#ff8000] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] 
          max-h-[85vh] overflow-y-auto 
          md:relative md:inset-auto md:max-h-none md:shadow-none md:bg-transparent md:translate-y-0
        `}
      >
        {/* Mobile Drag Handle */}
        <div className="flex justify-center py-4 md:hidden sticky top-0 bg-[#FDFCFB] z-10" onClick={onToggle}>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="px-5 pb-10 md:px-0 md:pb-0">
          {/* Header & Search */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Snack Marketplace</h3>
              {isOpen && (
                <button onClick={onToggle} className="md:hidden text-white font-bold text-xs uppercase">Close</button>
              )}
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search cravings..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange/5 outline-none transition-all text-sm font-bold shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            {CATEGORIES.map((category) => {
              const categorySnacks = SNACKS.filter(s => 
                s.category === category.id && 
                s.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (categorySnacks.length === 0) return null;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-black text-slate-800 uppercase tracking-tight text-xs">{category.label}</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-4 grid grid-cols-2 gap-3"
                      >
                        {categorySnacks.map((snack) => {
                          const canAdd = canAddSnack(snack.id);
                          return (
                            <motion.button
                              key={snack.id}
                              whileTap={canAdd ? { scale: 0.96 } : {}}
                              onClick={() => onAddSnack(snack.id)}
                              disabled={!canAdd}
                              className={`group relative flex flex-col p-2 rounded-[1.8rem] border-2 transition-all ${
                                canAdd ? 'bg-white border-transparent hover:border-orange/20 shadow-sm' : 'bg-slate-50 border-transparent opacity-40 grayscale'
                              }`}
                            >
                              <div className="relative aspect-square w-full mb-3 bg-slate-50 rounded-[1.4rem] overflow-hidden flex items-center justify-center border border-slate-100">
                                {!imageErrors[snack.id] ? (
                                  <img 
                                    src={snack.image} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    onError={() => setImageErrors(prev => ({ ...prev, [snack.id]: true }))}
                                  />
                                ) : <span className="text-4xl">{snack.icon}</span>}
                                
                                {snack.popular && (
                                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles size={8} className="text-orange" /> POPULAR
                                  </div>
                                )}
                              </div>

                              <div className="text-left px-2">
                                <p className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">{snack.name}</p>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-black text-orange">${snack.price}</p>
                                  <div className="bg-slate-100 p-1 rounded-lg group-hover:bg-orange group-hover:text-white transition-colors">
                                    <Plus size={12} strokeWidth={3} />
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}