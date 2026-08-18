"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingBag, ShieldCheck } from "lucide-react";

export function OrderSummary() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <ShoppingBag className="size-4" />
        </div>
        <h3 className="font-bold text-base text-foreground">Order Summary</h3>
      </div>

      {/* Items list */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.menuItemId}
            className="flex items-center justify-between text-sm gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="truncate">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold text-foreground shrink-0">
              ₹{(item.price * item.quantity).toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="pt-4 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes & GST (10%)</span>
          <span className="font-medium text-foreground">₹{tax.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Partner Fee</span>
          <span className="font-medium text-foreground">₹{deliveryFee.toFixed(0)}</span>
        </div>
        <div className="pt-3 border-t border-border/80 flex justify-between items-baseline text-sm font-bold text-foreground">
          <span>Grand Total</span>
          <span className="text-xl font-black text-primary">
            ₹{total.toFixed(0)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/40">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
        <span>Safe & Contactless Delivery guaranteed</span>
      </div>
    </div>
  );
}
