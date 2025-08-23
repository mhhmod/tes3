import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/constants";
import { type Product } from "@shared/schema";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  onQuickView: (product: Product) => void;
  onNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ProductGrid({ onQuickView, onNotification }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/products", activeFilter === "all" ? undefined : activeFilter],
    queryFn: () => getProducts(activeFilter === "all" ? undefined : activeFilter),
  });

  if (error) {
    return (
      <div className="text-center py-12" data-testid="products-error">
        <p className="text-red-400">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <section id="collection" className="py-20 bg-grind-surface" data-testid="collection-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl mb-4" data-testid="section-title">
            Featured Collection
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto" data-testid="section-description">
            Carefully curated pieces that define modern streetwear. Each item is
            crafted with premium materials and attention to detail.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12" data-testid="filter-tabs">
          <div className="bg-grind-dark rounded-lg p-1 flex space-x-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeFilter === category.id
                    ? "bg-grind-primary text-white"
                    : "hover:bg-grind-surface text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveFilter(category.id)}
                data-testid={`filter-${category.id}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="products-loading">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-grind-dark rounded-xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-80 bg-gray-600"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12" data-testid="products-empty">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onNotification={onNotification}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
