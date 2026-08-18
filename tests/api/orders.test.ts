import { describe, it, expect, vi } from "vitest";
import { POST as createOrderHandler, GET as getOrdersHandler } from "@/app/api/orders/route";
import * as nextAuth from "next-auth";

describe("Orders API", () => {
  it("rejects order creation without authentication", async () => {
    vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({
        deliveryAddress: "123 Main St",
        customerPhone: "+91 9876543210",
        items: [{ menuItemId: "item_1", quantity: 1 }],
      }),
    });

    const res = await createOrderHandler(req);
    expect(res.status).toBe(401);
  });

  it("creates order and calculates prices accurately for authenticated user", async () => {
    vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce({
      user: { id: "user_demo", name: "John Doe", email: "user@fooddash.com", role: "USER" },
    } as any);

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({
        deliveryAddress: "456 Park Avenue, Mumbai",
        customerPhone: "+91 9876543210",
        deliveryNotes: "Leave at door",
        items: [
          { menuItemId: "item_1", quantity: 1 }, // Margherita Pizza: 299
          { menuItemId: "item_4", quantity: 2 }, // Classic Burger: 199 * 2 = 398
        ],
      }),
    });

    const res = await createOrderHandler(req);
    expect(res.status).toBe(201);

    const order = await res.json();
    expect(order).toHaveProperty("id");
    expect(order.orderNumber).toMatch(/^ORD-[A-Z0-9]{6}$/);
    expect(order.status).toBe("ORDER_RECEIVED");
    expect(order.subtotal).toBe(697); // 299 + 398
    expect(order.tax).toBe(69.7);
    expect(order.deliveryFee).toBe(40);
    expect(order.total).toBe(806.7);
    expect(order.items.length).toBe(2);
  });

  it("validates phone number and empty items", async () => {
    vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce({
      user: { id: "user_demo", name: "John Doe", email: "user@fooddash.com", role: "USER" },
    } as any);

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({
        deliveryAddress: "123 Short",
        customerPhone: "invalid_phone",
        items: [],
      }),
    });

    const res = await createOrderHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });
});
