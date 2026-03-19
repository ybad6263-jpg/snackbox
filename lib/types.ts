export type SnackSize = 1 | 2 | 4;

export interface Snack {
  id: string;
  name: string;
  price: number;
  image: string; // Add this
  icon: string;  // Keep as fallback
  size: number;
  category: 'sweet' | 'savory' | 'drinks';
}

export interface BoxItem {
  snackId: string;
  snack: Snack;
  position: number;
}

export interface QuickAddTheme {
  name: string;
  description: string;
  price : number;
  snacks: string[];
  icon: string
}
