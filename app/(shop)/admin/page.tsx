import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminOrderList } from "@/components/admin/order-list";
import { redirect } from "next/navigation";
import { ShieldCheck, Utensils } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  const orders = await db.getOrders();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Active Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage live restaurant orders, advance cooking and delivery stages in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-border/60 text-xs">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Utensils className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Logged in as {session.user.name}</p>
            <p className="text-muted-foreground">{session.user.email} (Admin)</p>
          </div>
        </div>
      </div>

      <AdminOrderList initialOrders={orders} />
    </div>
  );
}
