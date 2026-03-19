'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BoxGrid } from '@/components/BoxGrid';
import { SnackMenu } from '@/components/SnackMenu';
import { ReviewBox } from '@/components/ReviewBox';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { QuickAddThemes } from '@/components/QuickAddThemes';
import { useSnackBox } from '@/hooks/useSnackBox';
import { SNACKS } from '@/lib/snacks';

export default function Home() {
  const snackBox = useSnackBox();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

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
    if (snackId) {
      handleAddSnack(snackId);
    }
  };

  const filledSlots = snackBox.getTotalSlots();
  const remainingSlots = snackBox.getRemainingSlots();
  const totalPrice = snackBox.getTotalPrice();

  return (
    <div className="min-h-screen bg-cream">
      <Header filledSlots={filledSlots} />
          {/* Quick Add Themes Section */}
      {snackBox.items.length === 0 && (
        <QuickAddThemes
          onAddTheme={snackBox.addQuickTheme}
          isBoxFull={snackBox.isFull}
          remainingSlots={remainingSlots}
        />
      )}

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 md:flex md:gap-8 md:py-10">
        {/* Main Content */}
        <div className="md:flex-1 mb-8 md:mb-0">
          <BoxGrid
            items={snackBox.items}
            onRemoveSnack={snackBox.removeSnack}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Snack Menu (Desktop Sidebar) */}
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

  

      {/* Mobile Snack Menu (Bottom Drawer) */}
      <div className="md:hidden">
        <SnackMenu
          onAddSnack={handleAddSnack}
          canAddSnack={handleCanAddSnack}
          remainingSlots={remainingSlots}
          isOpen={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        totalPrice={totalPrice}
        itemCount={snackBox.items.length}
        onClick={() => setReviewOpen(true)}
      />

      {/* Mobile Review Button */}
      {snackBox.items.length > 0 && (
        <button
          onClick={() => setReviewOpen(true)}
          className="fixed bottom-4 right-4 sm:hidden z-20 bg-orange text-white rounded-full shadow-lg hover:bg-orange/90 transition-colors p-4 flex items-center justify-center"
        >
          <span className="text-2xl">📦</span>
        </button>
      )}

      {/* Review Box Modal */}
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
