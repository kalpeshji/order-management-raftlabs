"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, ShoppingBag, ShieldAlert, BookOpen } from "lucide-react";
import { UserMenu } from "./auth/user-menu";
import { CartIcon } from "./cart/cart-icon";
import { CartDrawer } from "./cart/cart-drawer";
import { useSession } from "next-auth/react";

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
          >
            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
              <UtensilsCrossed className="size-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground font-sans">
              Food<span className="text-primary font-black">Dash</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="size-4 text-muted-foreground" />
              <span>Menu</span>
            </Link>

            {session?.user && (
              <Link
                href="/orders"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="size-4 text-muted-foreground" />
                <span>My Orders</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-500 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10"
              >

                <ShieldAlert className="size-4" />
                <span>All Orders</span>
              </Link>
            )}
          </nav>

          {/* Right actions: Cart & User */}
          <div className="flex items-center gap-3">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Slide-over cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
