export default function Hero() {
  const scrollToCollection = () => {
    const element = document.getElementById("collection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="hero-gradient relative overflow-hidden" data-testid="hero-section">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1
              className="font-poppins font-bold text-5xl lg:text-7xl leading-tight mb-6"
              data-testid="hero-title"
            >
              Elevate Your{" "}
              <span className="text-grind-primary">Streetwear</span> Game
            </h1>
            <p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              data-testid="hero-description"
            >
              Discover premium quality streetwear designed for the modern urban
              lifestyle. Minimal design, maximum impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToCollection}
                className="bg-grind-primary hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:transform hover:scale-105"
                data-testid="button-shop-collection"
              >
                Shop Collection
              </button>
              <button
                className="border border-white/20 hover:border-grind-primary text-white px-8 py-4 rounded-lg font-semibold transition-all"
                data-testid="button-watch-lookbook"
              >
                Watch Lookbook
              </button>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
              alt="Premium black t-shirt showcase"
              className="w-full rounded-2xl shadow-2xl image-zoom"
              data-testid="hero-product-image"
            />

            {/* Floating stats */}
            <div className="absolute top-4 right-4 glass-effect rounded-lg p-4" data-testid="hero-rating-stat">
              <div className="text-center">
                <div className="text-2xl font-bold text-grind-primary">4.9</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-4" data-testid="hero-customers-stat">
              <div className="text-center">
                <div className="text-2xl font-bold text-grind-primary">10K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
