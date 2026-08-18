"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState } from "react";

interface CartIconProps {
  onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center size-10 rounded-full border border-border/80 bg-background/80 hover:bg-accent text-foreground transition-all duration-200 shadow-2xs hover:scale-105"
      aria-label="View Cart"
    >
      <ShoppingBag className="size-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-sm animate-in zoom-in-50">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
