import { describe, it, expect, vi } from "vitest";
import { PATCH as statusHandler } from "@/app/api/orders/[id]/status/route";
import * as nextAuth from "next-auth";

describe("Order Status API", () => {
  it("rejects non-admin users from updating status", async () => {
    vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce({
      user: { id: "user_demo", name: "John Doe", email: "user@fooddash.com", role: "USER" },
    } as any);

    const req = new Request("http://localhost:3000/api/orders/order_sample_1/status", {
      method: "PATCH",
      body: JSON.stringify({ status: "OUT_FOR_DELIVERY" }),
    });

    const res = await statusHandler(req, { params: Promise.resolve({ id: "order_sample_1" }) });
    expect(res.status).toBe(403);
  });

  it("allows admin to advance status with valid transition", async () => {
    vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce({
      user: { id: "user_admin", name: "Admin", email: "admin@fooddash.com", role: "ADMIN" },
    } as any);

    const req = new Request("http://localhost:3000/api/orders/order_sample_1/status", {
      method: "PATCH",
      body: JSON.stringify({
        status: "OUT_FOR_DELIVERY",
        note: "Handed over to rider",
      }),
    });

    const res = await statusHandler(req, { params: Promise.resolve({ id: "order_sample_1" }) });
    expect(res.status).toBe(200);

    const updated = await res.json();
    expect(updated.status).toBe("OUT_FOR_DELIVERY");
    expect(updated.statusHistory.some((h: any) => h.status === "OUT_FOR_DELIVERY")).toBe(true);
  });
});
