import { db } from "@/lib/db";

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

  const stream = new ReadableStream({
    async start(controller) {
      // Real-time SSE stream pushing live admin status updates to client
      const poll = async () => {
        while (!closed) {
          try {
            const currentOrder = await db.getOrderById(id);
            if (!currentOrder) {
              closed = true;
              break;
            }

            // Only push when status actually changes (e.g., when Admin updates it)
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

          // Check for admin status updates every 1.5 seconds
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
