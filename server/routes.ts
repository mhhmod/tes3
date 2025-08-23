import type { Express } from "express";
import express from "express";
import path from "path";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let products;
      if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart endpoints
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "anonymous";
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "anonymous";
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId,
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      if (quantity === 0) {
        const deleted = await storage.removeFromCart(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: "Cart item not found" });
        }
        return res.status(204).send();
      }
      
      const updatedItem = await storage.updateCartItem(req.params.id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const deleted = await storage.removeFromCart(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "anonymous";
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders endpoint
  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "anonymous";
      
      // Get cart items to include in order
      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => 
        sum + parseFloat(item.product.price) * item.quantity, 0
      );
      
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));
      
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        subtotal: subtotal.toFixed(2),
        total: subtotal.toFixed(2), // No tax for now
        items: orderItems,
      });
      
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after successful order
      await storage.clearCart(sessionId);
      
      // In a real app, you would send this to n8n webhook here
      // const webhookUrl = process.env.N8N_WEBHOOK_URL;
      // if (webhookUrl) {
      //   await fetch(webhookUrl, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(order)
      //   });
      // }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Serve vanilla site
  app.use("/vanilla", express.static(path.join(process.cwd(), "client/public/vanilla")));

  const httpServer = createServer(app);
  return httpServer;
}
