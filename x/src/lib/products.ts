import { apiRequest } from "./queryClient";
import { type Product } from "@shared/schema";

export async function getProducts(category?: string, featured?: boolean): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (featured) params.append("featured", "true");
  
  const response = await apiRequest("GET", `/api/products?${params}`);
  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await apiRequest("GET", `/api/products/${id}`);
  return response.json();
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getSessionId(): string {
  const stored = localStorage.getItem("grindctrl_session_id");
  if (stored) return stored;
  
  const newId = generateSessionId();
  localStorage.setItem("grindctrl_session_id", newId);
  return newId;
}
