"use client";

import Image from "next/image";
import { MapPin, Phone, User, Calendar, Receipt } from "lucide-react";

interface OrderItemInfo {
  id: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  menuItem?: {
    name: string;
    image: string;
    category: string;
  };
}

interface OrderDetailsProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryNotes?: string | null;
    status: string;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    items: OrderItemInfo[];
    createdAt: string | Date;
  };
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Order Reference
          </span>
          <h2 className="text-xl font-extrabold text-foreground font-mono">
            {order.orderNumber}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <Calendar className="size-3.5" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Delivery details */}
      <div className="space-y-3 text-xs bg-muted/40 p-4 rounded-xl border border-border/50">
        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
          Delivery Address
        </h4>
        <div className="flex items-start gap-2 text-foreground">
          <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">{order.deliveryAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <Phone className="size-4 text-primary shrink-0" />
          <span>{order.customerPhone}</span>
        </div>
        {order.deliveryNotes && (
          <p className="text-muted-foreground italic pl-6">
            Note: &ldquo;{order.deliveryNotes}&rdquo;
          </p>
        )}
      </div>

      {/* Item Breakdown */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
          Items Ordered ({order.items.length})
        </h4>
        <div className="divide-y divide-border/60">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-sm gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.menuItem?.image && (
                  <div className="relative size-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50">
                    <Image
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="truncate">
                  <p className="font-medium text-foreground truncate">
                    {item.menuItem?.name || "Food Item"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.unitPrice} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-foreground shrink-0">
                ₹{item.itemTotal.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="pt-4 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">₹{order.subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (10%)</span>
          <span className="font-medium text-foreground">₹{order.tax.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="font-medium text-foreground">₹{order.deliveryFee.toFixed(0)}</span>
        </div>
        <div className="pt-3 border-t border-border/80 flex justify-between items-baseline text-sm font-bold text-foreground">
          <span>Total Paid (COD)</span>
          <span className="text-xl font-black text-primary">
            ₹{order.total.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
