import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            About GrindCTRL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're redefining streetwear with premium quality, sustainable materials, 
            and designs that speak to the modern urban lifestyle.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2020, GrindCTRL emerged from the streets with a simple mission: 
              to create premium streetwear that doesn't compromise on quality or values. 
              We believe fashion should be both expressive and responsible.
            </p>
            <p className="text-gray-600">
              Every piece in our collection is carefully crafted using sustainable materials 
              and ethical manufacturing processes. We're not just making clothes—we're 
              building a movement that values quality over quantity, purpose over profit.
            </p>
            <Link href="/products">
              <Button size="lg">Shop Our Collection</Button>
            </Link>
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
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We use eco-friendly materials and responsible manufacturing 
                processes to minimize our environmental impact.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-gray-600">
                Every piece is crafted with premium materials and attention 
                to detail that ensures longevity and comfort.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Creativity</h3>
              <p className="text-gray-600">
                We collaborate with artists and designers to create unique 
                pieces that express individuality and urban culture.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Our diverse team of designers, creators, and streetwear enthusiasts 
            work together to bring you the best in urban fashion.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Alex Chen</h3>
              <p className="text-gray-600">Creative Director</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Maya Rodriguez</h3>
              <p className="text-gray-600">Head of Design</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Jordan Kim</h3>
              <p className="text-gray-600">Sustainability Lead</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-black text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of a community that values quality, creativity, and sustainability. 
            Follow us on social media and stay updated with our latest drops.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Follow on Instagram
            </Button>
            <Link href="/contact">
              <Button variant="secondary">Get in Touch</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}