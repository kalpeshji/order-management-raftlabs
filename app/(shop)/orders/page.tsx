import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderCard } from "@/components/order/order-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await db.getOrders(session.user.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Track active food orders and view past delivery receipts
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 backdrop-blur-xs space-y-4">
          <div className="size-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">No orders yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              You haven&apos;t placed any orders yet. Browse our delicious menu and treat yourself!
            </p>
          </div>
          <Link href="/">
            <Button className="rounded-xl gap-2 font-semibold">
              <span>Explore Menu</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
