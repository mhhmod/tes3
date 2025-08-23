import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const refreshWishlist = () => {
    setWishlist(storage.getWishlist());
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const toggleWishlist = (productId: string) => {
    const added = storage.toggleWishlist(productId);
    refreshWishlist();
    return added;
  };

  const isInWishlist = (productId: string) => {
    return storage.isInWishlist(productId);
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isInWishlist,
    refreshWishlist
  };
}