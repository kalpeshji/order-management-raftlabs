"use client";

import { cn } from "@/lib/utils";
import {
  Utensils,
  Pizza,
  Sandwich,
  Coffee,
  IceCream,
  Soup,
  Sparkles,
} from "lucide-react";

export const CATEGORIES = [
  { id: "ALL", label: "All Items", icon: Sparkles },
  { id: "PIZZA", label: "Pizzas", icon: Pizza },
  { id: "BURGERS", label: "Burgers", icon: Sandwich },
  { id: "PASTA", label: "Pasta", icon: Utensils },
  { id: "SIDES", label: "Sides", icon: Soup },
  { id: "BEVERAGES", label: "Drinks", icon: Coffee },
  { id: "DESSERTS", label: "Desserts", icon: IceCream },
] as const;

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-2xs border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
