"use client";

import { useEffect, useState, use } from "react";
import { StatusTracker } from "@/components/order/status-tracker";
import { OrderDetails } from "@/components/order/order-details";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error("Order not found or access denied");
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Connect to SSE stream for real-time status updates
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`/api/orders/${id}/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data);
          setOrder((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              status: update.status,
              updatedAt: update.updatedAt,
              statusHistory: update.statusHistory || prev.statusHistory,
            };
          });

          if (update.status === "DELIVERED" || update.status === "CANCELLED") {
            eventSource?.close();
            setIsConnected(false);
          }
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.error("EventSource failed", e);
    }

    // Polling fallback every 6 seconds if SSE disconnects
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchOrder();
      }
    }, 6000);

    return () => {
      eventSource?.close();
      clearInterval(interval);
    };
  }, [id, isConnected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading live order status...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
          <p className="font-semibold text-sm">{error || "Order not found"}</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            Return to Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>All My Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Order #{order.orderNumber}
            </h1>
          </div>
        </div>
      </div>

      {/* Grid Layout: Timeline Tracker + Order Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <StatusTracker
            currentStatus={order.status}
            statusHistory={order.statusHistory}
          />
        </div>

        <div className="lg:col-span-6">
          <OrderDetails order={order} />
        </div>
      </div>
    </div>
  );
}
