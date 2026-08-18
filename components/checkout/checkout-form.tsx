"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart";
import { createOrderSchema } from "@/lib/validations/order";
import { Loader2, MapPin, Phone, FileText, User } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    deliveryAddress: "123 Main Street, Apartment 4B, Mumbai 400001",
    customerPhone: "+91 9876543210",
    deliveryNotes: "Please ring the bell and leave at door",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add some delicious items first!");
      return;
    }

    const payload = {
      deliveryAddress: formData.deliveryAddress,
      customerPhone: formData.customerPhone,
      deliveryNotes: formData.deliveryNotes || undefined,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
    };

    const result = createOrderSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = result.error.flatten().fieldErrors;
      Object.entries(flattened).forEach(([k, v]) => {
        if (v && v.length > 0) fieldErrors[k] = v[0];
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to place order");
        return;
      }

      // Clear cart on success
      clearCart();

      // Redirect to live order tracking page
      router.push(`/orders/${data.id}`);
    } catch {
      setServerError("Network error. Could not place order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <MapPin className="size-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground">Delivery Details</h3>
          <p className="text-xs text-muted-foreground">Where should we deliver your order?</p>
        </div>
      </div>

      {/* User info summary */}
      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 text-xs">
        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
          <User className="size-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{session?.user?.name || "Customer"}</p>
          <p className="text-muted-foreground">{session?.user?.email}</p>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label htmlFor="customerPhone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Phone className="size-3.5 text-muted-foreground" />
          <span>Contact Phone Number</span>
        </label>
        <Input
          id="customerPhone"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.customerPhone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
          }
          aria-invalid={!!errors.customerPhone}
          className="h-10 rounded-xl"
        />
        {errors.customerPhone && (
          <p className="text-xs text-destructive">{errors.customerPhone}</p>
        )}
      </div>

      {/* Delivery Address */}
      <div className="space-y-1.5">
        <label htmlFor="deliveryAddress" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" />
          <span>Full Delivery Address</span>
        </label>
        <textarea
          id="deliveryAddress"
          rows={3}
          placeholder="House/Flat No., Building Name, Street, Landmark, City, Pincode"
          value={formData.deliveryAddress}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))
          }
          aria-invalid={!!errors.deliveryAddress}
          className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.deliveryAddress && (
          <p className="text-xs text-destructive">{errors.deliveryAddress}</p>
        )}
      </div>

      {/* Delivery Instructions */}
      <div className="space-y-1.5">
        <label htmlFor="deliveryNotes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          <span>Delivery Instructions (Optional)</span>
        </label>
        <Input
          id="deliveryNotes"
          type="text"
          placeholder="e.g. Ring the bell, leave at security, extra napkins"
          value={formData.deliveryNotes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, deliveryNotes: e.target.value }))
          }
          className="h-10 rounded-xl"
        />
      </div>

      {serverError && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/25 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin mr-2" />
            <span>Processing Order...</span>
          </>
        ) : (
          <span>Place Order (Cash on Delivery)</span>
        )}
      </Button>
    </form>
  );
}
