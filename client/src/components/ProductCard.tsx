import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/storage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const success = await addToCart(product.id);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const added = toggleWishlist(product.id);
    toast({
      title: added ? "Added to wishlist" : "Removed from wishlist",
      description: added 
        ? `${product.name} has been added to your wishlist.`
        : `${product.name} has been removed from your wishlist.`,
    });
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer" data-testid={`card-product-${product.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex gap-1">
              {product.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="destructive"
                  className="text-xs px-2 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white ${
              isWishlisted ? 'text-red-500' : 'text-gray-400'
            }`}
            onClick={handleToggleWishlist}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>

          {/* Product Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              className="w-full bg-white text-black hover:bg-gray-100"
              onClick={handleAddToCart}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-sm lg:text-base line-clamp-2" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" data-testid={`text-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}