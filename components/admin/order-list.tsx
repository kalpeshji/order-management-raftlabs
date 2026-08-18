"use client";

import { useState } from "react";
import { StatusUpdater } from "./status-updater";
import { Clock, ChefHat, Bike, PackageCheck, AlertCircle, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminOrderListProps {
  initialOrders: any[];
}

export function AdminOrderList({ initialOrders }: AdminOrderListProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusUpdated = (updatedOrder: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    ORDER_RECEIVED: {
      label: "Order Received",
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      icon: Clock,
    },
    PREPARING: {
      label: "Preparing",
      bg: "bg-amber-500/10 border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      icon: ChefHat,
    },
    OUT_FOR_DELIVERY: {
      label: "Out for Delivery",
      bg: "bg-purple-500/10 border-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      icon: Bike,
    },
    DELIVERED: {
      label: "Delivered",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      icon: PackageCheck,
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "bg-destructive/10 border-destructive/20",
      text: "text-destructive",
      icon: AlertCircle,
    },
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "ORDER_RECEIVED", label: "New" },
            { id: "PREPARING", label: "Cooking" },
            { id: "OUT_FOR_DELIVERY", label: "On The Way" },
            { id: "DELIVERED", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={isRefreshing}
          className="rounded-xl h-8 text-xs gap-1.5 shrink-0 self-end sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Orders Grid/List */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.ORDER_RECEIVED;
            const StatusIcon = statusInfo.icon;
            const itemsText = order.items
              .map((i: any) => `${i.quantity}x ${i.menuItem?.name || "Item"}`)
              .join(", ");

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <StatusIcon className="size-3" />
                      <span>{statusInfo.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    {order.customerName} &bull;{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      {order.customerPhone}
                    </span>
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {order.deliveryAddress}
                  </p>

                  <p className="text-xs text-foreground font-medium bg-muted/40 p-2 rounded-lg inline-block">
                    🛒 {itemsText} &bull;{" "}
                    <span className="font-bold text-primary">
                      ₹{order.total.toFixed(0)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/60">
                  <StatusUpdater
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdated={handleStatusUpdated}
                  />

                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs gap-1">
                      <Eye className="size-3.5" />
                      <span>View</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-sm text-muted-foreground font-medium">
            No orders found matching the filter.
          </p>
        </div>
      )}
    </div>
  );
}
