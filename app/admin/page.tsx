'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Clock, MapPin, Phone, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // REAL-TIME: This listens for new orders and updates the UI instantly
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, 
        (payload) => setOrders((prev) => [payload.new, ...prev]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          Ayaung Order Manager
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {orders.length} Total Orders
        </p>
      </header>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-800 text-lg">{order.customer_name}</h3>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <Phone size={12} />
                  <span className="text-[10px] font-bold">{order.phone}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                order.status === 'pending' ? 'bg-orange/10 text-orange' : 'bg-green-100 text-green-600'
              }`}>
                {order.status}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Package size={12} className="text-slate-300" />
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-sm font-black text-slate-900">{order.total_price.toLocaleString()} Ks</div>
              {order.status === 'pending' && (
                <button 
                  onClick={() => updateStatus(order.id, 'delivered')}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}