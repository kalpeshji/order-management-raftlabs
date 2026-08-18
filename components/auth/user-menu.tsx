"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  LogOut,
  ShoppingBag,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-8 w-20 bg-muted/60 animate-pulse rounded-lg" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-medium">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="font-medium shadow-sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors shadow-xs text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase">
          {session.user.name?.charAt(0) || "U"}
        </div>
        <span className="hidden sm:inline-block max-w-[120px] truncate text-foreground font-medium">
          {session.user.name}
        </span>
        {isAdmin && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            Admin
          </span>
        )}
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover/95 backdrop-blur-md p-1.5 text-popover-foreground shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-2 border-b border-border/60 mb-1">
            <p className="text-xs font-medium text-foreground truncate">
              {session.user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>

          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ShoppingBag className="size-4 text-muted-foreground" />
            <span>My Orders</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
            >
              <ShieldAlert className="size-4" />
              <span>Kitchen Dashboard</span>
            </Link>
          )}

          <div className="border-t border-border/60 my-1" />

          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
