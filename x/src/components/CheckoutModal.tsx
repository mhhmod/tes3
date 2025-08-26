import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function CheckoutModal({ isOpen, onClose, onNotification }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const { cartItems, cartTotal, clearCart } = useCart();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutFormData) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      onNotification("Order placed successfully!", "success");
      setStep(3);
    },
    onError: (error) => {
      onNotification("Failed to place order. Please try again.", "error");
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    setStep(2);
    setTimeout(() => {
      createOrderMutation.mutate(data);
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  const progress = (step / 3) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="checkout-modal">
      <div className="bg-grind-surface rounded-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="font-poppins font-semibold text-xl" data-testid="checkout-title">
            Checkout
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-checkout"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? "bg-grind-primary" : "bg-gray-600"
                }`}
              >
                1
              </div>
              <span className={step >= 1 ? "font-medium" : "text-gray-400"}>
                Shipping
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-600 mx-4 relative">
              <div
                className="progress-bar h-full rounded transition-all duration-300"
                style={{ width: `${Math.min(progress, 66)}%` }}
              ></div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? "bg-grind-primary" : "bg-gray-600"
                }`}
              >
                2
              </div>
              <span className={step >= 2 ? "font-medium" : "text-gray-400"}>
                Payment
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-600 mx-4 relative">
              <div
                className="progress-bar h-full rounded transition-all duration-300"
                style={{ width: step >= 3 ? "100%" : "0%" }}
              ></div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 3 ? "bg-grind-primary" : "bg-gray-600"
                }`}
              >
                3
              </div>
              <span className={step >= 3 ? "font-medium" : "text-gray-400"}>
                Review
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-6">
          {/* Form */}
          <div>
            {step === 1 && (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="checkout-form">
                <h3 className="font-poppins font-semibold text-lg mb-4">
                  Shipping Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      className="bg-grind-dark border-gray-600"
                      data-testid="input-first-name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      className="bg-grind-dark border-gray-600"
                      data-testid="input-last-name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="bg-grind-dark border-gray-600"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    className="bg-grind-dark border-gray-600"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...form.register("address")}
                    placeholder="Street address"
                    className="bg-grind-dark border-gray-600"
                    data-testid="input-address"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...form.register("city")}
                      className="bg-grind-dark border-gray-600"
                      data-testid="input-city"
                    />
                    {form.formState.errors.city && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      {...form.register("postalCode")}
                      className="bg-grind-dark border-gray-600"
                      data-testid="input-postal-code"
                    />
                    {form.formState.errors.postalCode && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-4">
                    Payment Method
                  </h3>
                  <RadioGroup
                    value={form.watch("paymentMethod")}
                    onValueChange={(value) => form.setValue("paymentMethod", value)}
                    className="space-y-3"
                    data-testid="payment-methods"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:border-grind-primary transition-all cursor-pointer"
                        onClick={() => form.setValue("paymentMethod", method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <i className={`${method.icon} text-grind-primary`}></i>
                        <Label htmlFor={method.id} className="cursor-pointer">
                          {method.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-grind-primary hover:bg-red-600"
                  data-testid="button-complete-order"
                >
                  Complete Order
                </Button>
              </form>
            )}

            {step === 2 && (
              <div className="text-center py-12" data-testid="processing-order">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-grind-primary mx-auto mb-4"></div>
                <h3 className="font-poppins font-semibold text-xl mb-2">
                  Processing Your Order
                </h3>
                <p className="text-gray-400">Please wait while we process your order...</p>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12" data-testid="order-success">
                <div className="text-center mb-6">
                  <i className="fas fa-check-circle text-6xl text-green-400 mb-4"></i>
                  <h3 className="font-poppins font-semibold text-2xl mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Thank you for your order. You will receive a confirmation email shortly.
                  </p>
                  <Button
                    onClick={handleClose}
                    className="bg-grind-primary hover:bg-red-600"
                    data-testid="button-continue-shopping"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4" data-testid="order-summary-title">
              Order Summary
            </h3>

            <div className="bg-grind-dark rounded-lg p-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 mb-4 last:mb-0"
                  data-testid={`summary-item-${item.id}`}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ", "}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      {(parseFloat(item.product.price) * item.quantity).toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span data-testid="summary-subtotal">{cartTotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span data-testid="summary-tax">0 EGP</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-600 pt-2">
                <span>Total:</span>
                <span data-testid="summary-total">{cartTotal.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
