import { storage, type Product } from './storage';

export async function initializeProducts(): Promise<void> {
  await storage.loadProducts();
}

export function getProducts(): Product[] {
  return storage.getProducts();
}

export function getProduct(id: string): Product | undefined {
  return storage.getProduct(id);
}

export function getFeaturedProducts(): Product[] {
  return storage.getFeaturedProducts();
}

export function getProductsByCategory(category: string): Product[] {
  return storage.getProductsByCategory(category);
}

export const categories = [
  { id: 'all', name: 'All Products', filter: null },
  { id: 'tshirts', name: 'T-Shirts', filter: 'tshirts' },
  { id: 'hoodies', name: 'Hoodies', filter: 'hoodies' },
  { id: 'bottoms', name: 'Bottoms', filter: 'bottoms' },
  { id: 'accessories', name: 'Accessories', filter: 'accessories' },
  { id: 'footwear', name: 'Footwear', filter: 'footwear' }
];