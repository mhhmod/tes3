import { useState } from "react";
import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ProductCard({ product, onQuickView, onNotification }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  
  const { addToCart, isAddingToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      onNotification("Please select a size", "error");
      return;
    }

    addToCart({
      productId: product.id,
      quantity: 1,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    });

    onNotification("Item added to cart!", "success");
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product.id);
    onNotification(
      added ? "Added to wishlist!" : "Removed from wishlist",
      added ? "success" : "info"
    );
  };

  const discount = product.originalPrice
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="product-hover bg-grind-surface rounded-xl overflow-hidden group" data-testid={`card-product-${product.id}`}>
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-80 object-cover image-zoom"
          data-testid={`img-product-${product.id}`}
        />

        {/* Wishlist Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
          onClick={handleWishlistToggle}
          data-testid={`button-wishlist-${product.id}`}
        >
          <i
            className={`fas fa-heart wishlist-heart ${
              isInWishlist(product.id) ? "active text-grind-primary" : ""
            }`}
          ></i>
        </button>

        {/* Tags */}
        {product.tags?.map((tag) => (
          <div
            key={tag}
            className="absolute top-4 left-4 bg-grind-primary text-white px-3 py-1 rounded-full text-sm font-semibold"
            data-testid={`tag-${tag.toLowerCase()}`}
          >
            {tag}
          </div>
        ))}

        {/* Discount Badge */}
        {discount > 0 && (
          <div
            className="absolute top-4 left-4 bg-grind-accent text-white px-3 py-1 rounded-full text-sm font-semibold"
            style={{ marginTop: (product.tags?.length || 0) > 0 ? "2.5rem" : "0" }}
            data-testid={`discount-badge-${product.id}`}
          >
            {discount}% OFF
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <button
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            onClick={() => onQuickView(product)}
            data-testid={`button-quick-view-${product.id}`}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-poppins font-semibold text-lg mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-gray-400 mb-4" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>

        {/* Color Options */}
        {product.colors.length > 0 && (
          <div className="flex space-x-2 mb-4" data-testid={`color-options-${product.id}`}>
            {product.colors.map((color) => (
              <div
                key={color.name}
                className={`color-option ${selectedColor === color.name ? "selected" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.name)}
                data-testid={`color-option-${color.name.toLowerCase()}`}
              ></div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.originalPrice && (
              <span className="text-gray-400 line-through" data-testid={`text-original-price-${product.id}`}>
                {product.originalPrice} EGP
              </span>
            )}
            <span className="text-xl font-bold" data-testid={`text-price-${product.id}`}>
              {product.price} EGP
            </span>
          </div>
          <button
            className="bg-grind-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            data-testid={`button-add-cart-${product.id}`}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-3" data-testid={`rating-${product.id}`}>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`${
                  i < Math.floor(parseFloat(product.rating || "0"))
                    ? "fas fa-star"
                    : "far fa-star"
                }`}
              ></i>
            ))}
          </div>
          <span className="text-gray-400 text-sm ml-2">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
