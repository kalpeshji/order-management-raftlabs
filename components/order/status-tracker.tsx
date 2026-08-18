"use client";

import { Check, Clock, Utensils, Bike, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ORDER_STAGES = [
  {
    key: "ORDER_RECEIVED",
    label: "Order Received",
    description: "Your order has been sent to the kitchen",
    icon: Clock,
  },
  {
    key: "PREPARING",
    label: "Preparing Your Food",
    description: "Our chefs are cooking your fresh meal",
    icon: Utensils,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    description: "Delivery partner is heading to your address",
    icon: Bike,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Enjoy your delicious hot meal!",
    icon: CheckCircle2,
  },
] as const;

interface StatusTrackerProps {
  currentStatus: string;
  statusHistory?: { status: string; timestamp: string | Date; note?: string | null }[];
}

export function StatusTracker({ currentStatus, statusHistory = [] }: StatusTrackerProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
        <AlertCircle className="size-6 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs">This order has been cancelled by the restaurant.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Order Status</h3>
          <p className="text-xs text-muted-foreground">Real-time status updates</p>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Tracking</span>
        </div>
      </div>

      {/* Vertical Stepper */}
      <div className="relative pl-3 space-y-8 before:absolute before:left-7.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
        {ORDER_STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = stage.icon;

          const historyItem = statusHistory.find((h) => h.status === stage.key);
          const timeStr = historyItem
            ? new Date(historyItem.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <div key={stage.key} className="relative flex items-start gap-4 group">
              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isDone &&
                    "bg-emerald-600 border-emerald-600 text-white shadow-xs",
                  isCurrent &&
                    "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 scale-110 ring-4 ring-primary/20",
                  isPending &&
                    "bg-background border-border text-muted-foreground"
                )}
              >
                {isDone ? (
                  <Check className="size-4 stroke-[3]" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1 pt-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={cn(
                      "font-semibold text-sm leading-tight",
                      isCurrent && "text-primary font-bold",
                      isDone && "text-foreground",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </h4>
                  {timeStr && (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {timeStr}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {historyItem?.note || stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
