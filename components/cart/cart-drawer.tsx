"use client";

import { X, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { CartItemRow } from "./cart-item-row";
import Link from "next/link";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/80 bg-card/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground leading-tight">
                Your Cart
              </h2>
              <p className="text-xs text-muted-foreground">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length > 0 ? (
            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <CartItemRow key={item.menuItemId} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="size-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                <ShoppingBag className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mb-6">
                Explore our menu with delicious pizzas, burgers, pasta, and treats!
              </p>
              <Button onClick={onClose} size="sm" className="rounded-xl">
                Browse Menu
              </Button>
            </div>
          )}
        </div>

        {/* Footer with checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border/80 bg-card/60 space-y-3">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Restaurant Charges (10%)</span>
                <span className="font-medium text-foreground">₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-foreground">₹{deliveryFee.toFixed(0)}</span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between text-sm font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-primary text-base">₹{total.toFixed(0)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={onClose} className="block w-full">
              <Button className="w-full h-11 rounded-xl text-sm font-semibold gap-2 shadow-md shadow-primary/20">
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-center text-[11px] text-muted-foreground hover:text-destructive transition-colors py-1"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
