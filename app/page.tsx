'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BoxGrid } from '@/components/BoxGrid';
import { SnackMenu } from '@/components/SnackMenu';
import { ReviewBox } from '@/components/ReviewBox';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { QuickAddThemes } from '@/components/QuickAddThemes';
import { AuthModal } from '@/components/Auth'; 
import { useSnackBox } from '@/hooks/useSnackBox';
import { SNACKS } from '@/lib/snacks';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const snackBox = useSnackBox();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1. Monitor Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      // AUTO-FLOW: If they just logged in and the auth modal was open, 
      // close auth and jump straight to the checkout review.
      if (event === 'SIGNED_IN' && authOpen) {
        setAuthOpen(false);
        setReviewOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [authOpen]);

  // 2. Logic: Gatekeeper for Checkout
  const handleCheckoutRequest = () => {
    if (snackBox.items.length === 0) return; // Don't open if empty
    
    if (!user) {
      setAuthOpen(true);
    } else {
      setReviewOpen(true);
    }
  };

  const handleAddSnack = (snackId: string) => {
    return snackBox.addSnack(snackId);
  };

  const handleCanAddSnack = (snackId: string) => {
    const snack = SNACKS.find(s => s.id === snackId);
    if (!snack) return false;
    return snackBox.canAddSnack(snack);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const snackId = e.dataTransfer.getData('snackId');
    if (snackId) handleAddSnack(snackId);
  };

  const filledSlots = snackBox.getTotalSlots();
  const remainingSlots = snackBox.getRemainingSlots();
  const totalPrice = snackBox.getTotalPrice();

  return (
    <div className="min-h-screen bg-cream selection:bg-orange/30">
      <Header filledSlots={filledSlots} />
      
      {snackBox.items.length === 0 && (
        <QuickAddThemes
          onAddTheme={snackBox.addQuickTheme}
          isBoxFull={snackBox.isFull}
          remainingSlots={remainingSlots}
        />
      )}

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 md:flex md:gap-8 md:py-10">
        {/* Main Box Grid */}
        <div className="md:flex-1 mb-8 md:mb-0">
          <BoxGrid
            items={snackBox.items}
            onRemoveSnack={snackBox.removeSnack}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Sidebar Snack Menu (Desktop Only) */}
        <div className="hidden md:block md:w-80">
          <div className="sticky top-20">
            <SnackMenu
              onAddSnack={handleAddSnack}
              canAddSnack={handleCanAddSnack}
              remainingSlots={remainingSlots}
              isOpen={true}
              onToggle={() => {}}
            />
          </div>
        </div>
      </main>

      {/* Drawer Snack Menu (Mobile Only) */}
      <div className="md:hidden">
        <SnackMenu
          onAddSnack={handleAddSnack}
          canAddSnack={handleCanAddSnack}
          remainingSlots={remainingSlots}
          isOpen={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Floating Action Button (Universal) */}
      <FloatingActionButton
        totalPrice={totalPrice}
        itemCount={snackBox.items.length}
        onClick={handleCheckoutRequest} 
      />

      {/* Mobile-only Quick Access Checkout */}
      {snackBox.items.length > 0 && (
        <button
          onClick={handleCheckoutRequest}
          className="fixed bottom-4 right-4 sm:hidden z-20 bg-orange text-white rounded-full shadow-lg active:scale-95 transition-all p-4 flex items-center justify-center border-4 border-white"
        >
          <span className="text-2xl leading-none">📦</span>
        </button>
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
      />

      <ReviewBox
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        items={snackBox.items}
        totalPrice={totalPrice}
        onClearBox={snackBox.clearBox}
        onRemoveItem={snackBox.removeSnack}
      />
    </div>
  );
}