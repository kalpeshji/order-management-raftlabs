"use client";

import { useState, useMemo } from "react";
import { MenuItemCard, MenuItemData } from "./menu-item-card";
import { CategoryFilter } from "./category-filter";
import { Search, UtensilsCrossed, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuGridProps {
  initialItems: MenuItemData[];
}

export function MenuGrid({ initialItems }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Category Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-xl">
          <CategoryFilter
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full bg-background/80 border-border/80 text-sm focus-visible:ring-primary shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 backdrop-blur-xs">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <UtensilsCrossed className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No food items found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            We couldn&apos;t find anything matching your search. Try adjusting your
            category or search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
