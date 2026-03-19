'use client';

import { motion } from 'framer-motion';
import { QUICK_ADD_THEMES } from '@/lib/snacks';
import { Gift, PartyPopper, Crown, Sparkles, Plus } from 'lucide-react';

interface QuickAddThemesProps {
  onAddTheme: (snackIds: string[]) => void;
  isBoxFull: boolean;
  remainingSlots: number;
}

const THEME_CONFIG: Record<string, { icon: any; color: string; bg: string; gradient: string }> = {
  'Starter Box': { 
    icon: <Gift size={16} />, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    gradient: 'from-blue-500 to-blue-600'
  },
  'Party Box': { 
    icon: <PartyPopper size={16} />, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    gradient: 'from-purple-500 to-purple-600'
  },
  'Ultra Gift Set': { 
    icon: <Crown size={16} />, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50',
    gradient: 'from-amber-500 to-orange'
  },
};

export function QuickAddThemes({ onAddTheme, isBoxFull, remainingSlots }: QuickAddThemesProps) {
  return (
    <div className="w-full bg-transparent py-2">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Sparkles className="text-orange" size={14} fill="currentColor" />
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
          Gift Packs (အထုပ်လိုက်)
        </h3>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-1 px-1 snap-x">
        {QUICK_ADD_THEMES.map((theme) => {
          const config = THEME_CONFIG[theme.name] || THEME_CONFIG['Starter Box'];
          const canFit = remainingSlots >= theme.snacks.length;

          return (
            <motion.button
              key={theme.name}
              whileTap={canFit ? { scale: 0.96 } : {}}
              onClick={() => canFit && onAddTheme(theme.snacks)}
              disabled={!canFit}
              className={`
                snap-start flex-shrink-0 w-[150px] group relative
                rounded-[2rem] overflow-hidden transition-all duration-300 border-2
                ${!canFit 
                  ? 'bg-slate-100 opacity-50 grayscale border-slate-200' 
                  : 'bg-white border-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] shadow-slate-200'}
              `}
            >
              {/* Header Icon Section */}
              <div className={`w-full py-3 flex justify-center items-center ${config.bg}`}>
                <div className={`p-2 rounded-xl bg-white shadow-sm ${config.color}`}>
                    {config.icon}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-3 pb-0">
                <h4 className="font-black text-slate-800 text-[11px] leading-tight mb-1 truncate">
                  {theme.name}
                </h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-2">
                  {theme.snacks.length} Items
                </p>
                <p className="text-[9px] text-slate-500 line-clamp-2 leading-tight mb-3 min-h-[1.5rem]">
                  {theme.description}
                </p>
              </div>

              {/* THE PRICE BAR - High Visibility */}
              <div className={`
                mt-1 w-full py-2.5 px-3 flex items-center justify-between text-white
                ${canFit ? `bg-gradient-to-r ${config.gradient}` : 'bg-slate-400'}
              `}>
                <span className="text-[11px] font-black tracking-tight">
                    {theme.price.toLocaleString()} Ks
                </span>
                <div className="bg-white/20 p-1 rounded-lg">
                    <Plus size={10} strokeWidth={4} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}