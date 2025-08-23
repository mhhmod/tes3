import { useState, useEffect } from 'react';
import { storage, type CartItem } from '@/lib/storage';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = () => {
    setCartItems(storage.getCartItems());
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setIsLoading(true);
    try {
      const success = storage.addToCart(productId, quantity, selectedSize, selectedColor);
      if (success) {
        refreshCart();
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const success = storage.updateCartItem(itemId, quantity);
      if (success) {
        refreshCart();
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const success = storage.removeFromCart(itemId);
      if (success) {
        refreshCart();
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      storage.clearCart();
      refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = storage.getCartTotal();
  const cartCount = storage.getCartCount();

  return {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart
  };
}