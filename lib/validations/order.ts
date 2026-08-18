import { z } from "zod";

export const createOrderSchema = z.object({
  deliveryAddress: z.string().min(5, "Address must be at least 5 characters"),
  deliveryNotes: z.string().optional().or(z.literal("")),
  customerPhone: z
    .string()
    .regex(/^\+?[\d\s-]{7,15}$/, "Invalid phone number"),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1, "Minimum quantity is 1").max(99),
      })
    )
    .min(1, "Cart must contain at least 1 item"),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "ORDER_RECEIVED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
  note: z.string().optional(),
});

// Valid status transitions map
export const VALID_TRANSITIONS: Record<string, string[]> = {
  ORDER_RECEIVED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
