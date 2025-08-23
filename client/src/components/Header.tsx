import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface HeaderProps {
  onCartToggle: () => void;
  onWishlistToggle: () => void;
}

export default function Header({ onCartToggle, onWishlistToggle }: HeaderProps) {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect" data-testid="header-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2" data-testid="logo">
            <i className="fas fa-fire text-grind-primary text-xl"></i>
            <span className="font-poppins font-bold text-xl">GrindCTRL</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="hover:text-grind-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("collection")}
              className="hover:text-grind-primary transition-colors"
              data-testid="nav-collection"
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-grind-primary transition-colors"
              data-testid="nav-about"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-grind-primary transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
          </div>

          {/* Cart and Menu */}
          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 hover:text-grind-primary transition-colors"
              onClick={onCartToggle}
              data-testid="button-cart"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-grind-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="cart-count"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="relative p-2 hover:text-grind-primary transition-colors"
              onClick={onWishlistToggle}
              data-testid="button-wishlist"
            >
              <i className="fas fa-heart text-lg"></i>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-grind-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="wishlist-count"
                >
                  {wishlistCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" data-testid="button-mobile-menu">
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
