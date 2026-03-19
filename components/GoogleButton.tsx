// components/GoogleButton.tsx
'use client';
import { supabase } from '@/lib/supabase';

export function GoogleButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <button 
      onClick={handleLogin}
      className="w-full py-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Continue with Google</span>
    </button>
  );
}