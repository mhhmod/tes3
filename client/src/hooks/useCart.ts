import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getSessionId } from "@/lib/products";
import { type CartItemWithProduct, type InsertCartItem } from "@shared/schema";

export function useCart() {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  const {
    data: cartItems = [],
    isLoading,
    error,
  } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart", {
        headers: {
          "x-session-id": sessionId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "sessionId">) => {
      const response = await apiRequest("POST", "/api/cart", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
}
