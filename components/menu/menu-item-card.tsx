"use client";

import { Plus, Minus, Check, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useState } from "react";

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  isAvailable?: boolean;
}

interface MenuItemCardProps {
  item: MenuItemData;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;
  const priceNum =
    typeof item.price === "string" ? parseFloat(item.price) : Number(item.price);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: priceNum,
      image: item.image,
    });
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 600);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
      <div>
        {/* Fixed 192px image container with fallback */}
        <div className="relative h-48 w-full overflow-hidden bg-zinc-800">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center bg-zinc-800 text-zinc-300 p-4 text-center">
              <Utensils className="size-8 mb-2 text-amber-400" />
              <span className="text-xs font-semibold">{item.name}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-md shadow-xs border border-white/20">
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-base sm:text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <span className="font-bold text-base sm:text-lg text-foreground whitespace-nowrap">
              ₹{priceNum.toFixed(0)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        {quantity === 0 ? (
          <Button
            onClick={handleAdd}
            className={`w-full h-9 rounded-xl font-medium transition-all shadow-xs gap-1.5 ${
              isAddedAnim ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""
            }`}
          >
            {isAddedAnim ? (
              <>
                <Check className="size-4 animate-in zoom-in-50" />
                Added!
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Add to Cart
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-primary/10 rounded-xl p-1 border border-primary/20">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="size-7 rounded-lg text-primary hover:bg-primary/20"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="font-bold text-sm text-primary px-3">
              {quantity} in cart
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="size-7 rounded-lg text-primary hover:bg-primary/20"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
