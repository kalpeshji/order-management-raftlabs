"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, XCircle } from "lucide-react";

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (updatedOrder: any) => void;
}

export function StatusUpdater({
  orderId,
  currentStatus,
  onStatusUpdated,
}: StatusUpdaterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const nextStatusMap: Record<
    string,
    { next: string; label: string; btnColor: string }
  > = {
    ORDER_RECEIVED: {
      next: "PREPARING",
      label: "Start Cooking",
      btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    PREPARING: {
      next: "OUT_FOR_DELIVERY",
      label: "Dispatch Driver",
      btnColor: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    OUT_FOR_DELIVERY: {
      next: "DELIVERED",
      label: "Mark Delivered",
      btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  };

  const nextAction = nextStatusMap[currentStatus];

  const updateStatus = async (status: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        onStatusUpdated(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {
    return (
      <span className="text-xs text-muted-foreground italic">
        Order {currentStatus.toLowerCase()}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {nextAction && (
        <Button
          size="sm"
          disabled={isLoading}
          onClick={() => updateStatus(nextAction.next)}
          className={`h-8 rounded-lg text-xs font-semibold gap-1.5 shadow-2xs ${nextAction.btnColor}`}
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <span>{nextAction.label}</span>
              <ArrowRight className="size-3" />
            </>
          )}
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading}
        onClick={() => updateStatus("CANCELLED")}
        className="h-8 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <XCircle className="size-3.5 mr-1" />
        Cancel
      </Button>
    </div>
  );
}
