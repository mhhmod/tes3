import { type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, type CartItemWithProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Luxury Cropped Black T-Shirt",
        description: "Premium cotton blend with perfect fit. Minimalist design meets maximum impact.",
        price: "300.00",
        originalPrice: "350.00",
        category: "tshirts",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        colors: [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Gray", value: "#6B7280" }
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        inStock: true,
        featured: true,
        rating: "4.9",
        reviewCount: 127,
        tags: ["HOT"],
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Oversized Essential Hoodie",
        description: "Comfort meets style in premium fleece. Perfect for layering or standalone wear.",
        price: "650.00",
        originalPrice: null,
        category: "hoodies",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        colors: [
          { name: "Charcoal", value: "#374151" },
          { name: "Black", value: "#000000" },
          { name: "Navy", value: "#1E3A8A" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true,
        featured: true,
        rating: "4.7",
        reviewCount: 89,
        tags: [],
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Minimal Logo Cap",
        description: "Classic adjustable cap with embroidered logo. Completes any streetwear look.",
        price: "250.00",
        originalPrice: null,
        category: "accessories",
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        colors: [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Red", value: "#DC2626" }
        ],
        sizes: ["One Size"],
        inStock: true,
        featured: true,
        rating: "5.0",
        reviewCount: 45,
        tags: ["NEW"],
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      sizes: insertProduct.sizes || [],
      colors: insertProduct.colors || [],
      images: insertProduct.images || [],
      tags: insertProduct.tags || [],
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    const itemsWithProducts: CartItemWithProduct[] = [];
    
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists with same product, size, and color
    const existingItem = Array.from(this.cartItems.values()).find(
      item => 
        item.sessionId === insertItem.sessionId &&
        item.productId === insertItem.productId &&
        item.selectedSize === insertItem.selectedSize &&
        item.selectedColor === insertItem.selectedColor
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new item
      const id = randomUUID();
      const item: CartItem = {
        ...insertItem,
        id,
        quantity: insertItem.quantity || 1,
        createdAt: new Date(),
      };
      this.cartItems.set(id, item);
      return item;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries()).filter(([_, item]) => item.sessionId === sessionId);
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const trackingNumber = `GC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const order: Order = {
      ...insertOrder,
      id,
      trackingNumber,
      courier: "BOSTA",
      status: "pending",
      tax: insertOrder.tax || "0.00",
      createdAt: new Date(),
    };
    
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
