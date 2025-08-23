import { useState, useEffect } from "react";
import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSizeGuide: () => void;
  onNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onSizeGuide,
  onNotification,
}: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart, isAddingToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || "");
      setSelectedSize(product.sizes[0] || "");
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      onNotification("Please select a size", "error");
      return;
    }

    addToCart({
      productId: product.id,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    });

    onNotification("Item added to cart!", "success");
    onClose();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="quick-view-modal">
      <div className="bg-grind-surface rounded-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="font-poppins font-semibold text-xl" data-testid="quick-view-title">
            Quick View
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-quick-view"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full rounded-lg"
                data-testid="quick-view-main-image"
              />
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
                data-testid="button-zoom-image"
              >
                <i className="fas fa-expand text-white"></i>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2" data-testid="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className={`w-full h-16 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? "border-grind-primary" : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedImage(index)}
                    data-testid={`thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h3 className="font-poppins font-bold text-2xl mb-2" data-testid="quick-view-product-name">
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex text-yellow-400" data-testid="quick-view-rating">
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
                <span className="text-gray-400" data-testid="quick-view-review-count">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold" data-testid="quick-view-price">
                  {product.price} EGP
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through" data-testid="quick-view-original-price">
                      {product.originalPrice} EGP
                    </span>
                    <span className="bg-grind-primary text-white px-2 py-1 rounded text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6" data-testid="color-selection">
                <h4 className="font-semibold mb-3">Color</h4>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      className={`color-option ${selectedColor === color.name ? "selected" : ""}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      data-testid={`quick-view-color-${color.name.toLowerCase()}`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div className="mb-6" data-testid="size-selection">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Size</h4>
                  <button
                    className="text-grind-primary text-sm hover:underline"
                    onClick={onSizeGuide}
                    data-testid="button-size-guide"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`border rounded p-3 text-center transition-all ${
                        selectedSize === size
                          ? "border-grind-primary bg-grind-primary/20"
                          : "border-gray-600 hover:border-grind-primary"
                      }`}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`quick-view-size-${size.toLowerCase()}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex space-x-4 mb-6">
              <div className="flex items-center border border-gray-600 rounded-lg" data-testid="quantity-selector">
                <button
                  className="p-3 hover:bg-gray-600 transition-all"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  -
                </button>
                <span className="px-4 py-3 border-x border-gray-600" data-testid="quantity-value">
                  {quantity}
                </span>
                <button
                  className="p-3 hover:bg-gray-600 transition-all"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  +
                </button>
              </div>
              <button
                className="flex-1 bg-grind-primary hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                data-testid="button-add-to-cart"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                className={`p-3 border border-gray-600 rounded-lg hover:border-grind-primary transition-all ${
                  isInWishlist(product.id) ? "text-grind-primary" : ""
                }`}
                onClick={handleWishlistToggle}
                data-testid="button-wishlist-toggle"
              >
                <i className="fas fa-heart"></i>
              </button>
            </div>

            {/* Product Features */}
            <div className="space-y-3 text-sm" data-testid="product-features">
              <div className="flex items-center space-x-3">
                <i className="fas fa-truck text-grind-primary"></i>
                <span>Free shipping worldwide</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-undo text-grind-primary"></i>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-certificate text-grind-primary"></i>
                <span>Premium quality guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
