import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage, type Order } from '@/lib/storage';

export default function OrderSuccess() {
  const [, params] = useRoute('/order-success/:id');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const foundOrder = storage.getOrder(params.id);
      setOrder(foundOrder || null);
    }
    setIsLoading(false);
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-8 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. We'll send you a confirmation email shortly.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Number:</span>
                  <p className="font-medium" data-testid="text-order-number">{order.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tracking Number:</span>
                  <p className="font-medium" data-testid="text-tracking-number">{order.trackingNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <p className="font-medium" data-testid="text-order-total">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.firstName} {order.lastName}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-600">{order.city}, {order.postalCode}</p>
                <p className="text-gray-600">{order.email}</p>
                <p className="text-gray-600">{order.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="text-sm text-gray-600">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' • '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </div>
                      <div className="text-sm">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-gray-600">Free worldwide shipping (3-7 business days)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Button className="flex-1" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}