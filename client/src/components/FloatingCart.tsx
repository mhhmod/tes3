import { useCart } from "@/hooks/useCart";

interface FloatingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function FloatingCart({ isOpen, onClose, onCheckout }: FloatingCartProps) {
  const { cartItems, cartTotal, updateCart, removeFromCart } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart({ id, quantity });
    }
  };

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 transition-all duration-300 z-50 ${
        isOpen ? "right-5" : "-right-96"
      }`}
      data-testid="floating-cart"
    >
      <div className="glass-effect rounded-lg w-80 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-poppins font-semibold text-lg" data-testid="cart-title">
            Shopping Cart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-cart"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 max-h-60 overflow-y-auto" data-testid="cart-items">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4" data-testid="cart-empty">
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-grind-surface rounded-lg"
                data-testid={`cart-item-${item.id}`}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                  data-testid={`cart-item-image-${item.id}`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm" data-testid={`cart-item-name-${item.id}`}>
                    {item.product.name}
                  </h4>
                  <p className="text-gray-400 text-xs" data-testid={`cart-item-options-${item.id}`}>
                    {item.selectedSize && `Size: ${item.selectedSize}`}
                    {item.selectedSize && item.selectedColor && ", "}
                    {item.selectedColor && `Color: ${item.selectedColor}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" data-testid={`cart-item-price-${item.id}`}>
                    {(parseFloat(item.product.price) * item.quantity).toFixed(2)} EGP
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <button
                      className="w-6 h-6 bg-gray-600 rounded text-xs hover:bg-gray-500"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      data-testid={`button-decrease-${item.id}`}
                    >
                      -
                    </button>
                    <span className="text-xs" data-testid={`cart-item-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <button
                      className="w-6 h-6 bg-gray-600 rounded text-xs hover:bg-gray-500"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      data-testid={`button-increase-${item.id}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-600 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span data-testid="cart-subtotal-label">Subtotal:</span>
              <span data-testid="cart-subtotal-value">{cartTotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between mb-4">
              <span data-testid="cart-shipping-label">Shipping:</span>
              <span className="text-green-400" data-testid="cart-shipping-value">Free</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-gray-600 pt-2">
              <span data-testid="cart-total-label">Total:</span>
              <span data-testid="cart-total-value">{cartTotal.toFixed(2)} EGP</span>
            </div>

            <button
              className="w-full bg-grind-primary hover:bg-red-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all"
              onClick={onCheckout}
              data-testid="button-checkout"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
