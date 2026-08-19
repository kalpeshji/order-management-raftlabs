import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrderSchema } from "@/lib/validations/order";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { deliveryAddress, deliveryNotes, customerPhone, items } = result.data;

    // Verify the user actually exists in the database (guards against stale session tokens)
    const user = await db.getUserById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "Session expired. Please log out and sign in again." },
        { status: 401 }
      );
    }

    const order = await db.createOrder({
      userId: user.id,
      customerName: user.name,
      customerPhone,
      deliveryAddress,
      deliveryNotes,
      items,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || undefined;

    // Users only see their own orders; admins see all
    const userId = session.user.role === "ADMIN" ? undefined : session.user.id;

    const orders = await db.getOrders(userId, statusFilter);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
