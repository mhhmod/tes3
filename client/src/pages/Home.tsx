import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { initializeProducts } from '@/lib/products';

export default function Home() {
  useEffect(() => {
    initializeProducts();
  }, []);

  return (
    <div className="pt-16">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Carefully curated pieces that define modern streetwear. 
              Each item is crafted with premium materials and attention to detail.
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Crafted for the Streets</h2>
              <p className="text-gray-600">
                At GrindCTRL, we believe streetwear is more than fashion—it's a lifestyle. 
                Every piece is designed with purpose, crafted with premium materials, 
                and built to last through your urban adventures.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-sm">🌱</span>
                  </div>
                  <h3 className="font-semibold">Sustainable Materials</h3>
                  <p className="text-sm text-gray-600">Eco-friendly fabrics and responsible production.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">⭐</span>
                  </div>
                  <h3 className="font-semibold">Premium Quality</h3>
                  <p className="text-sm text-gray-600">Only the finest materials and craftsmanship.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                alt="Urban lifestyle"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                alt="Street style"
                className="w-full h-48 object-cover rounded-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}