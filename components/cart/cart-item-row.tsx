"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem, useCartStore } from "@/lib/store/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/60 last:border-0 group">
      <div className="relative size-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-border/50">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground mb-1.5">
          ₹{item.price.toFixed(0)} each
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/80 rounded-lg p-0.5 border border-border/60">
            <button
              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              className="size-6 flex items-center justify-center rounded-md text-foreground hover:bg-background transition-colors"
            >
              <Minus className="size-3" />
            </button>
            <span className="text-xs font-bold px-2 text-foreground">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              className="size-6 flex items-center justify-center rounded-md text-foreground hover:bg-background transition-colors"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.menuItemId)}
            className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
            title="Remove item"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-foreground">
          ₹{(item.price * item.quantity).toFixed(0)}
        </p>
      </div>
    </div>
  );
}
