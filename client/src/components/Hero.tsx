import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Streetwear
                </span>
                Game
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Discover premium quality streetwear designed for the modern urban lifestyle. 
                Minimal design, maximum impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                  Shop Collection
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                Watch Lookbook
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
                alt="Premium streetwear collection"
                className="w-full h-[600px] object-cover"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-8 -left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="font-medium text-sm">Free Worldwide Shipping</span>
                </div>
              </div>

              <div className="absolute bottom-8 -right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">★</span>
                  </div>
                  <span className="font-medium text-sm">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}