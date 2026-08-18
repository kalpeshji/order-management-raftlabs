import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Menu</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Checkout & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Confirm your delivery address and contact information to place your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Delivery Details Form */}
        <div className="lg:col-span-7">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
