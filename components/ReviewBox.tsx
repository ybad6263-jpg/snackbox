'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, MapPin, Phone, User, CheckCircle2, Navigation } from 'lucide-react';
import { BoxItem } from '@/lib/types';

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

  // 1. Get Geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          alert("တည်နေရာရရှိသွားပါပြီ! (Location Secured)");
        },
        () => alert("Location ခွင့်ပြုချက်ပေးရန် လိုအပ်ပါသည်။")
      );
    }
  };

  // 2. Send to Telegram
  const sendToTelegram = async () => {
    setLoading(true);
    const BOT_TOKEN = '8658213241:AAHRFoksCISDIn5mlCf11jvsCof3d_ayQ-g'; 
    const CHAT_ID = '8699240431';

    const itemText = items.map(i => `• ${i.snack.name} (${i.snack.price} Ks)`).join('\n');
    const googleMapsLink = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : 'Not Shared';

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

    try {
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
    } catch (error) {
      alert("Error sending order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'review') setStep('delivery');
    else if (step === 'delivery') sendToTelegram();
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => setStep('review'), 300);
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
                    {step === 'success' && 'Order တင်ပြီးပါပြီ!'}
                  </h2>
                </div>
              </div>
              <button onClick={resetAndClose} className="p-2 bg-slate-100 rounded-full"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {step === 'review' && (
                  <motion.div key="review" className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">{item.snack.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-700 text-sm">{item.snack.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{item.snack.price} Ks</p>
                        </div>
                        <button onClick={() => onRemoveItem(index)} className="p-2 text-slate-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {step === 'delivery' && (
                  <motion.div key="delivery" className="space-y-4">
                    <button 
                      onClick={handleGetLocation}
                      className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${location ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-500'}`}
                    >
                      <Navigation size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {location ? 'တည်နေရာရရှိပါပြီ' : 'Pin My Location (ပိုမိုမြန်ဆန်ရန်)'}
                      </span>
                    </button>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">နာမည် (Name)</label>
                        <input value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} type="text" placeholder="ကိုဖြိုး" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">ဖုန်းနံပါတ် (Phone)</label>
                        <input value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} type="tel" placeholder="09 123 456 789" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">မြို့နယ် (Township)</label>
                        <select value={formData.township} onChange={(e)=>setFormData({...formData, township: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm font-bold">
                            <option value="">မြို့နယ်ရွေးပါ</option>
                            {TOWNSHIPS.map(t => <option key={t.en} value={t.en}>{t.mm} ({t.en})</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">လမ်း / အိမ်အမှတ် (Address)</label>
                        <input value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} type="text" placeholder="ဥပမာ- လမ်း ၃၀၊ ၇၀ x ၇၁ ကြား" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm font-bold" />
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">အိုကေပါပြီ!</h3>
                    <p className="text-slate-400 text-sm mt-2 font-medium px-6">လူကြီးမင်း၏ Order ကို Telegram မှတစ်ဆင့် လက်ခံရရှိပါပြီ။ ခေတ္တစောင့်ဆိုင်းပေးပါ။</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
              {step !== 'success' && (
                <>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">စုစုပေါင်း ကျသင့်ငွေ</p>
                      <p className="text-3xl font-black text-slate-900">{totalPrice} Ks</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {step === 'delivery' && <button onClick={() => setStep('review')} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-sm">နောက်သို့</button>}
                    <button
                      onClick={handleNext}
                      disabled={loading || (step === 'delivery' && (!formData.name || !formData.phone))}
                      className="flex-[2] py-4 rounded-2xl bg-orange text-slate-950 font-black shadow-lg shadow-orange/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'ပို့နေပါပြီ...' : step === 'review' ? 'ရှေ့ဆက်မယ်' : 'Order အတည်ပြုမယ်'}
                      <ArrowRight size={18} />
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