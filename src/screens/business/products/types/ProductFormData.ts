export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  category: string;
  minStock?: number;
}

export type DialogMode = 'create' | 'edit' | 'view';

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports',
  'Books',
  'Health & Beauty',
  'Office Supplies',
  'Other',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
