// Client-side storage for GitHub Pages deployment
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  featured: boolean;
  images: string[];
  colors: { name: string; value: string }[];
  sizes: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  product: Product;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  subtotal: number;
  total: number;
  items: CartItem[];
  createdAt: Date;
  trackingNumber?: string;
}

class ClientStorage {
  private products: Product[] = [];
  
  async loadProducts(): Promise<void> {
    try {
      const response = await fetch('/products.json');
      const data = await response.json();
      this.products = data.products;
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter(p => p.featured);
  }

  getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.products;
    return this.products.filter(p => p.category === category);
  }

  // Cart - localStorage based
  getCartItems(): CartItem[] {
    try {
      const cart = localStorage.getItem('grindctrl_cart');
      if (!cart) return [];
      
      const items = JSON.parse(cart);
      return items.map((item: any) => ({
        ...item,
        product: this.getProduct(item.productId)!
      }));
    } catch {
      return [];
    }
  }

  addToCart(productId: string, quantity: number = 1, selectedSize?: string, selectedColor?: string): boolean {
    const product = this.getProduct(productId);
    if (!product) return false;

    const cart = this.getCartItems();
    const itemId = `${productId}_${selectedSize || 'default'}_${selectedColor || 'default'}`;
    
    const existingIndex = cart.findIndex(item => 
      item.productId === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: itemId,
        productId,
        quantity,
        selectedSize,
        selectedColor,
        product
      });
    }

    localStorage.setItem('grindctrl_cart', JSON.stringify(cart.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }))));

    return true;
  }

  updateCartItem(itemId: string, quantity: number): boolean {
    const cart = this.getCartItems();
    const index = cart.findIndex(item => item.id === itemId);
    
    if (index >= 0) {
      if (quantity <= 0) {
        return this.removeFromCart(itemId);
      }
      cart[index].quantity = quantity;
      localStorage.setItem('grindctrl_cart', JSON.stringify(cart.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))));
      return true;
    }
    return false;
  }

  removeFromCart(itemId: string): boolean {
    const cart = this.getCartItems();
    const filtered = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('grindctrl_cart', JSON.stringify(filtered.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }))));
    
    return true;
  }

  clearCart(): void {
    localStorage.removeItem('grindctrl_cart');
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getCartCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }

  // Wishlist
  getWishlist(): string[] {
    try {
      const wishlist = localStorage.getItem('grindctrl_wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      return [];
    }
  }

  toggleWishlist(productId: string): boolean {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index >= 0) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    
    localStorage.setItem('grindctrl_wishlist', JSON.stringify(wishlist));
    return index < 0; // Return true if added, false if removed
  }

  isInWishlist(productId: string): boolean {
    return this.getWishlist().includes(productId);
  }

  // Orders
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order {
    const id = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const trackingNumber = `TRK${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
    
    const order: Order = {
      ...orderData,
      id,
      trackingNumber,
      createdAt: new Date()
    };

    // Save order to localStorage
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('grindctrl_orders', JSON.stringify(orders));

    // Clear cart after successful order
    this.clearCart();

    return order;
  }

  getOrders(): Order[] {
    try {
      const orders = localStorage.getItem('grindctrl_orders');
      return orders ? JSON.parse(orders) : [];
    } catch {
      return [];
    }
  }

  getOrder(id: string): Order | undefined {
    return this.getOrders().find(order => order.id === id);
  }
}

export const storage = new ClientStorage();