import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col items-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-105 mb-2"
        >
          <div className="size-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <UtensilsCrossed className="size-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground font-sans">
            Food<span className="text-primary font-black">Dash</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          Delicious meals delivered fast to your doorstep
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} FoodDash Inc. All rights reserved.
      </div>
    </div>
  );
}
