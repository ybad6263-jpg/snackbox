'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, CheckCircle2, Navigation, Loader2 } from 'lucide-react';
import { BoxItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ReviewBoxProps {
  isOpen: boolean;
  onClose: () => void;
  items: BoxItem[];
  totalPrice: string;
  onClearBox: () => void;
  onRemoveItem: (index: number) => void;
}

const TOWNSHIPS = [
  { en: 'Chanayethazan', mm: 'ချမ်းအေးသာစံ' },
  { en: 'Mahar Aung Myay', mm: 'မဟာအောင်မြေ' },
  { en: 'Pyigyidagun', mm: 'ပြည်ကြီးတံခွန်' },
  { en: 'Amarapura', mm: 'အမရပူရ' },
  { en: 'Patheingyi', mm: 'ပုသိမ်ကြီး' },
  { en: 'Chanmyathazi', mm: 'ချမ်းမြသာစည်' },
  { en: 'Aungmyethazan', mm: 'အောင်မြေသာစံ' },
];

type CheckoutStep = 'review' | 'delivery' | 'success';

export function ReviewBox({ isOpen, onClose, items, totalPrice, onClearBox, onRemoveItem }: ReviewBoxProps) {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', township: '', address: '' });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Sync with Supabase User data if available
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || prev.name,
          // If they used phone login, we can auto-fill this too
          phone: user.phone || prev.phone 
        }));
      }
    };
    if (isOpen) getProfile();
  }, [isOpen]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => alert("Location ခွင့်ပြုချက်ပေးရန် လိုအပ်ပါသည်။")
      );
    }
  };

  const handleFinalOrder = async () => {
    setLoading(true);
    const BOT_TOKEN = '8658213241:AAHRFoksCISDIn5mlCf11jvsCof3d_ayQ-g'; 
    const CHAT_ID = '8699240431';

    const itemNames = items.map(i => i.snack.name);
    const itemText = items.map(i => `• ${i.snack.name} (${i.snack.price} Ks)`).join('\n');
    
    // Improved Google Maps Link logic
    const googleMapsLink = location 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}` 
      : 'Not Shared';

    try {
      // 1. Log to Supabase for Ayaung Software Company records
      const { error: dbError } = await supabase
        .from('orders')
        .insert([{
            customer_name: formData.name,
            phone: formData.phone,
            township: formData.township,
            address: formData.address,
            items: itemNames,
            total_price: parseInt(totalPrice.replace(/,/g, '')),
            lat: location?.lat,
            lng: location?.lng,
            status: 'pending'
        }]);

      if (dbError) throw dbError;

      // 2. Immediate Telegram Alert for the team
      const message = `
📦 *Order အသစ်ရောက်ပါပြီ!*
---------------------------
👤 *Customer:* ${formData.name}
📞 *Phone:* ${formData.phone}
📍 *Township:* ${formData.township}
🏠 *Address:* ${formData.address}
🗺️ *Map:* ${googleMapsLink}

🛒 *Items:*
${itemText}

💰 *Total:* ${totalPrice} Ks
---------------------------
`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      setStep('success');
      onClearBox();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'review') setStep('delivery');
    else if (step === 'delivery') handleFinalOrder();
  };

  const resetAndClose = () => {
    onClose();
    if (step === 'success') {
        setTimeout(() => setStep('review'), 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetAndClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative bg-[#FDFCFB] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-orange/10 p-2 rounded-xl">
                    {step === 'success' ? <CheckCircle2 className="text-green-500" /> : <ShoppingBag className="text-orange" size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {step === 'review' && 'ဝယ်မယ့်စာရင်း'}
                    {step === 'delivery' && 'ပို့ဆောင်မည့်လိပ်စာ'}
                    {step === 'success' && 'တင်ပြီးပါပြီ!'}
                  </h2>
                </div>
              </div>
              <button onClick={resetAndClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {step === 'review' && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-xs italic">Box is empty...</div>
                    ) : (
                        items.map((item, index) => (
                          <div key={index} className="group flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-orange/20 transition-all">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{item.snack.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-700 text-sm">{item.snack.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold tracking-wider">{item.snack.price} Ks</p>
                            </div>
                            <button onClick={() => onRemoveItem(index)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><X size={14} /></button>
                          </div>
                        ))
                    )}
                  </motion.div>
                )}

                {step === 'delivery' && (
                  <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <button 
                      onClick={handleGetLocation}
                      className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${location ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-200 text-slate-400 hover:border-orange/40'}`}
                    >
                      <Navigation size={16} fill={location ? "currentColor" : "none"} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {location ? 'တည်နေရာ သိရှိပြီးပါပြီ' : 'Pin My Location'}
                      </span>
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">နာမည်</label>
                            <input value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} type="text" placeholder="Name" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-orange/10 focus:border-orange transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">ဖုန်းနံပါတ်</label>
                            <input value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} type="tel" placeholder="09..." className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-orange/10 focus:border-orange transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">မြို့နယ်</label>
                            <select value={formData.township} onChange={(e)=>setFormData({...formData, township: e.target.value})} className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:border-orange">
                                <option value="">Select Township</option>
                                {TOWNSHIPS.map(t => <option key={t.en} value={t.en}>{t.mm} ({t.en})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">လိပ်စာအတိအကျ</label>
                            <textarea value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} placeholder="လမ်း၊ အိမ်အမှတ်..." className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold h-20 resize-none focus:ring-2 ring-orange/10 focus:border-orange transition-all" />
                        </div>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Thank You!</h3>
                    <p className="text-slate-500 text-sm mt-3 font-medium px-8 leading-relaxed italic">
                      လူကြီးမင်း၏ Order ကို လက်ခံရရှိပါပြီ။ ပစ္စည်းပို့ဆောင်ခါနီးတွင် ဖုန်းဆက်သွယ်ပေးပါမည်။
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
              {step !== 'success' && (
                <>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Payment</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">{totalPrice} Ks</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {step === 'delivery' && (
                        <button onClick={() => setStep('review')} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">Back</button>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={loading || items.length === 0 || (step === 'delivery' && (!formData.name || !formData.phone))}
                      className="flex-[2] py-4 rounded-2xl bg-orange text-slate-950 font-black shadow-lg shadow-orange/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 active:scale-95 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : step === 'review' ? 'Checkout' : 'Confirm Order'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}