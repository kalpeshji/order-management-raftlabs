import assert from "node:assert";
import { POST as registerHandler } from "../app/api/auth/register/route";
import { GET as menuHandler } from "../app/api/menu/route";
import { POST as orderHandler } from "../app/api/orders/route";
import { PATCH as statusHandler } from "../app/api/orders/[id]/status/route";

async function runTests() {
  console.log("==================================================================");
  console.log("🚀 RUNNING FOOD DELIVERY ORDER MANAGEMENT TEST SUITE (TDD)");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log("📦 1. AUTHENTICATION & USER REGISTRATION TESTS");
  await test("User registration validates matching passwords", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Mismatch User",
        email: "mismatch@example.com",
        password: "password123",
        confirmPassword: "different_password",
      }),
    });
    const res = await registerHandler(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, "Validation failed");
  });

  await test("User registration creates valid user account", async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Customer",
        email: uniqueEmail,
        phone: "+91 9876543210",
        password: "password123",
        confirmPassword: "password123",
      }),
    });
    const res = await registerHandler(req);
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.email, uniqueEmail);
    assert.strictEqual(data.role, "USER");
    assert.strictEqual(data.password, undefined);
  });

  await test("Prevents duplicate user registration", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Duplicate User",
        email: "user@fooddash.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    });
    const res = await registerHandler(req);
    assert.strictEqual(res.status, 409);
  });

  console.log("\n🍕 2. MENU DISPLAY & FILTERING TESTS");
  await test("Menu retrieval returns populated food catalog", async () => {
    const req = new Request("http://localhost:3000/api/menu");
    const res = await menuHandler(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.items));
    assert.ok(data.items.length >= 10);
    assert.ok(data.items[0].name);
    assert.ok(data.items[0].price);
    assert.ok(data.items[0].image);
  });

  await test("Menu filters by category correctly", async () => {
    const req = new Request("http://localhost:3000/api/menu?category=PIZZA");
    const res = await menuHandler(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.items.length > 0);
    data.items.forEach((item: any) => {
      assert.strictEqual(item.category, "PIZZA");
    });
  });

  console.log("\n🛒 3. ORDER PLACEMENT & PRICING VERIFICATION TESTS");
  await test("Rejects unauthenticated order placement", async () => {
    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({
        deliveryAddress: "123 Main St",
        customerPhone: "+91 9876543210",
        items: [{ menuItemId: "item_1", quantity: 1 }],
      }),
    });
    const res = await orderHandler(req);
    assert.strictEqual(res.status, 401);
  });

  let createdOrderId = "";
  await test("Creates authenticated order and calculates tamper-proof pricing", async () => {
    const userSession = {
      user: { id: "user_demo", name: "John Doe", email: "user@fooddash.com", role: "USER" },
    };

    const req = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "x-test-session": JSON.stringify(userSession),
      },
      body: JSON.stringify({
        deliveryAddress: "123 Marine Drive, Mumbai",
        customerPhone: "+91 9876543210",
        deliveryNotes: "Leave at door",
        items: [
          { menuItemId: "item_1", quantity: 1 }, // Margherita Pizza: 299
          { menuItemId: "item_4", quantity: 2 }, // Classic Burger: 199 * 2 = 398
        ],
      }),
    });

    const res = await orderHandler(req);
    assert.strictEqual(res.status, 201);
    const order = await res.json();
    assert.ok(order.id);
    createdOrderId = order.id;
    assert.ok(/^ORD-[A-Z0-9]{6}$/.test(order.orderNumber));
    assert.strictEqual(order.status, "ORDER_RECEIVED");
    assert.strictEqual(order.subtotal, 697);
    assert.strictEqual(order.tax, 69.7);
    assert.strictEqual(order.deliveryFee, 40);
    assert.strictEqual(order.total, 806.7);
    assert.strictEqual(order.items.length, 2);
  });

  console.log("\n🔄 4. ORDER STATUS & LIFECYCLE TRANSITION TESTS");
  await test("Rejects non-admin users from modifying order status", async () => {
    const userSession = {
      user: { id: "user_demo", name: "John Doe", role: "USER" },
    };

    const req = new Request(`http://localhost:3000/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: {
        "x-test-session": JSON.stringify(userSession),
      },
      body: JSON.stringify({ status: "PREPARING" }),
    });

    const res = await statusHandler(req, { params: Promise.resolve({ id: createdOrderId }) });
    assert.strictEqual(res.status, 403);
  });

  await test("Admin can advance order status according to state machine", async () => {
    const adminSession = {
      user: { id: "user_admin", name: "Admin", role: "ADMIN" },
    };

    const req = new Request(`http://localhost:3000/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: {
        "x-test-session": JSON.stringify(adminSession),
      },
      body: JSON.stringify({ status: "PREPARING", note: "Chef started cooking" }),
    });

    const res = await statusHandler(req, { params: Promise.resolve({ id: createdOrderId }) });
    assert.strictEqual(res.status, 200);
    const updated = await res.json();
    assert.strictEqual(updated.status, "PREPARING");
    assert.ok(updated.statusHistory.some((h: any) => h.status === "PREPARING"));
  });

  console.log("\n==================================================================");
  console.log(`🎉 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Fatal test runner error", e);
  process.exit(1);
});
