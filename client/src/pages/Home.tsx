import { useState } from "react";
import { type Product } from "@shared/schema";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import FloatingCart from "@/components/FloatingCart";
import QuickViewModal from "@/components/QuickViewModal";
import SizeGuideModal from "@/components/SizeGuideModal";
import CheckoutModal from "@/components/CheckoutModal";
import Footer from "@/components/Footer";
import NotificationToast, { type NotificationProps } from "@/components/NotificationToast";
import { LIFESTYLE_IMAGES } from "@/lib/constants";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-grind-dark text-white" data-testid="home-page">
      <Header
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onWishlistToggle={() => setIsWishlistOpen(!isWishlistOpen)}
      />

      <main>
        <Hero />
        
        <ProductGrid 
          onQuickView={handleQuickView}
          onNotification={showNotification}
        />

        {/* Lifestyle Gallery */}
        <section className="py-20 bg-grind-dark" data-testid="lifestyle-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-poppins font-bold text-4xl mb-4" data-testid="gallery-title">
                Styled by You
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto" data-testid="gallery-description">
                See how our community styles their GrindCTRL pieces. Share your look with #GrindCTRL
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="lifestyle-images">
              {LIFESTYLE_IMAGES.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                  data-testid={`lifestyle-image-${index}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Cart */}
      <FloatingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={closeQuickView}
        onSizeGuide={() => setIsSizeGuideOpen(true)}
        onNotification={showNotification}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={quickViewProduct?.category}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        onNotification={showNotification}
      />

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onHide={hideNotification}
      />
    </div>
  );
}
