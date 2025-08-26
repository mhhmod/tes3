import { useState, useEffect } from "react";

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("grindctrl_wishlist");
    if (stored) {
      try {
        setWishlistItems(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
        setWishlistItems([]);
      }
    }
  }, []);

  const addToWishlist = (productId: string) => {
    const newWishlist = [...wishlistItems, productId];
    setWishlistItems(newWishlist);
    localStorage.setItem("grindctrl_wishlist", JSON.stringify(newWishlist));
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlistItems.filter(id => id !== productId);
    setWishlistItems(newWishlist);
    localStorage.setItem("grindctrl_wishlist", JSON.stringify(newWishlist));
  };

  const toggleWishlist = (productId: string) => {
    if (wishlistItems.includes(productId)) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}
