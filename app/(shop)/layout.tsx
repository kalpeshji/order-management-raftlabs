import { Header } from "@/components/header";
import { SessionProvider } from "@/components/auth/session-provider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-border/80 bg-card/40 py-8 text-center text-xs text-muted-foreground">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-medium text-foreground">
              FoodDash &bull; Real-time Food Delivery & Order Management
            </p>
            <p>&copy; {new Date().getFullYear()} FoodDash Inc. Built with Next.js, TypeScript & Tailwind CSS.</p>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
