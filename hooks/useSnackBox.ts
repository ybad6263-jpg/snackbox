'use client';

import { useState, useCallback } from 'react';
import { Snack, BoxItem } from '@/lib/types';
import { SNACKS, MAX_SLOTS } from '@/lib/snacks';

export function useSnackBox() {
  const [items, setItems] = useState<BoxItem[]>([]);

  const snackMap = new Map(SNACKS.map(snack => [snack.id, snack]));

  const getTotalSlots = useCallback(() => {
    return items.reduce((sum, item) => sum + item.snack.size, 0);
  }, [items]);

  const getRemainingSlots = useCallback(() => {
    return MAX_SLOTS - getTotalSlots();
  }, [getTotalSlots]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.snack.price, 0).toFixed(2);
  }, [items]);

  const canAddSnack = useCallback((snack: Snack): boolean => {
    return getRemainingSlots() >= snack.size;
  }, [getRemainingSlots]);

  const addSnack = useCallback((snackId: string): boolean => {
    const snack = snackMap.get(snackId);
    if (!snack) return false;

    if (!canAddSnack(snack)) return false;

    const newItem: BoxItem = {
      snackId,
      snack,
      position: items.length,
    };

    setItems(prev => [...prev, newItem]);
    return true;
  }, [snackMap, canAddSnack, items.length]);

  const removeSnack = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearBox = useCallback(() => {
    setItems([]);
  }, []);

  const addQuickTheme = useCallback((snackIds: string[]) => {
    const newItems: BoxItem[] = [];
    let totalSlots = getTotalSlots();

    for (const snackId of snackIds) {
      const snack = snackMap.get(snackId);
      if (snack && totalSlots + snack.size <= MAX_SLOTS) {
        newItems.push({
          snackId,
          snack,
          position: items.length + newItems.length,
        });
        totalSlots += snack.size;
      }
    }

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
    }
  }, [snackMap, getTotalSlots, items.length]);

  return {
    items,
    addSnack,
    removeSnack,
    clearBox,
    addQuickTheme,
    getTotalSlots,
    getRemainingSlots,
    getTotalPrice,
    canAddSnack,
    isFull: getTotalSlots() >= MAX_SLOTS,
  };
}
