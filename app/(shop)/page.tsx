import { db } from "@/lib/db";
import { MenuGrid } from "@/components/menu/menu-grid";
import { Sparkles, Clock, ShieldCheck, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await db.getMenuItems();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 sm:p-10 shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs font-semibold backdrop-blur-md">
            <Flame className="size-3.5 text-primary" />
            <span>Fast & Hot Food Delivery in 30 Mins</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Craving something <span className="text-primary font-black">delicious?</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Choose from artisanal sourdough pizzas, gourmet smash burgers, handmade pastas, and mouthwatering desserts delivered directly to you.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-emerald-400" />
              <span>30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Fresh Ingredients</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-400" />
              <span>Free Delivery on ₹500+</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-20 size-60 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Menu Catalog Section */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Explore Our Menu
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select dishes, customize quantities, and order with real-time tracking
            </p>
          </div>
        </div>

        <MenuGrid initialItems={items} />
      </section>
    </div>
  );
}
