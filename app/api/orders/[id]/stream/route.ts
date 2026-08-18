import { db } from "@/lib/db";
import { VALID_TRANSITIONS } from "@/lib/validations/order";

const SIMULATION_DELAYS: Record<string, { next: "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED"; delay: number }> = {
  ORDER_RECEIVED: { next: "PREPARING", delay: 8000 },
  PREPARING: { next: "OUT_FOR_DELIVERY", delay: 12000 },
  OUT_FOR_DELIVERY: { next: "DELIVERED", delay: 15000 },
};

async function advanceOrderStatus(
  orderId: string,
  newStatus: "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED"
) {
  try {
    const order = await db.getOrderById(orderId);
    if (!order) return;

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(newStatus)) return;

    const statusNotes: Record<string, string> = {
      PREPARING: "Kitchen started preparing your meal",
      OUT_FOR_DELIVERY: "Driver is on the way with your food",
      DELIVERED: "Order successfully delivered! Enjoy your meal!",
    };

    await db.updateOrderStatus(orderId, newStatus, statusNotes[newStatus]);
  } catch (error) {
    console.error("Auto-simulation error:", error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await db.getOrderById(id);
  if (!order) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let lastStatus = "";
  let closed = false;
  let simulationStarted = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Start background auto-simulation
      const startSimulation = async () => {
        if (simulationStarted) return;
        simulationStarted = true;

        const currentOrder = await db.getOrderById(id);
        if (!currentOrder) return;

        let currentStatus = currentOrder.status;
        const simulate = async () => {
          const config = SIMULATION_DELAYS[currentStatus];
          if (!config || closed) return;

          await new Promise((resolve) => setTimeout(resolve, config.delay));
          if (closed) return;

          await advanceOrderStatus(id, config.next);
          currentStatus = config.next;

          await simulate();
        };

        simulate();
      };

      startSimulation();

      // Polling loop to push SSE events
      const poll = async () => {
        while (!closed) {
          try {
            const currentOrder = await db.getOrderById(id);
            if (!currentOrder) {
              closed = true;
              break;
            }

            if (currentOrder.status !== lastStatus) {
              lastStatus = currentOrder.status;
              const data = JSON.stringify({
                status: currentOrder.status,
                updatedAt: currentOrder.updatedAt,
                statusHistory: currentOrder.statusHistory,
              });

              controller.enqueue(encoder.encode(`data: ${data}\n\n`));

              if (
                currentOrder.status === "DELIVERED" ||
                currentOrder.status === "CANCELLED"
              ) {
                closed = true;
                controller.close();
                return;
              }
            }
          } catch {
            closed = true;
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      };

      poll();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
