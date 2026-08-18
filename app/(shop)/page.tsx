import { db } from "@/lib/db";
import { MenuGrid } from "@/components/menu/menu-grid";
import { Sparkles, Clock, ShieldCheck, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await db.getMenuItems();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Banner with High Contrast Vibrant Styling */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-10 shadow-2xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold tracking-wide backdrop-blur-md">
            <Flame className="size-3.5 text-amber-400 fill-amber-400" />
            <span>Fast & Hot Food Delivery in 30 Mins</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Craving something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 font-black">
              delicious?
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Choose from artisanal sourdough pizzas, gourmet smash burgers, handmade pastas, and mouthwatering desserts delivered fresh to your doorstep.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="size-4 text-emerald-400" />
              <span>30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Fresh Ingredients</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 size-80 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-20 size-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
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
