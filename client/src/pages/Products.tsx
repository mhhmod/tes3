import { useEffect } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { initializeProducts } from '@/lib/products';

export default function Products() {
  useEffect(() => {
    initializeProducts();
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete range of premium streetwear designed for the modern urban lifestyle.
          </p>
        </div>
        <ProductGrid />
      </div>
    </div>
  );
}