"use client";

import Link from "next/link";
import { ArrowRight, Clock, PackageCheck, AlertCircle, ChefHat, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string | Date;
    items: {
      id: string;
      quantity: number;
      menuItem?: { name: string };
    }[];
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const statusConfig: Record<
    string,
    { label: string; color: string; bg: string; icon: any }
  > = {
    ORDER_RECEIVED: {
      label: "Order Received",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      icon: Clock,
    },
    PREPARING: {
      label: "Preparing",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      icon: ChefHat,
    },
    OUT_FOR_DELIVERY: {
      label: "Out for Delivery",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      icon: Bike,
    },
    DELIVERED: {
      label: "Delivered",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icon: PackageCheck,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      icon: AlertCircle,
    },
  };

  const currentStatus = statusConfig[order.status] || statusConfig.ORDER_RECEIVED;
  const StatusIcon = currentStatus.icon;

  const totalItemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);
  const itemsSummary = order.items
    .map((i) => `${i.quantity}x ${i.menuItem?.name || "Item"}`)
    .join(", ");

  const dateStr = new Date(order.createdAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:shadow-md transition-all space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-foreground">
            {order.orderNumber}
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.bg} ${currentStatus.color}`}
        >
          <StatusIcon className="size-3.5" />
          <span>{currentStatus.label}</span>
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground line-clamp-1">
          {itemsSummary}
        </p>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
          </span>
          <span className="text-base font-bold text-foreground">
            ₹{order.total.toFixed(0)}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/60">
        <Link href={`/orders/${order.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 font-medium">
            <span>Track Order & View Receipt</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
