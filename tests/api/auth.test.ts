import { describe, it, expect } from "vitest";
import { POST as registerHandler } from "@/app/api/auth/register/route";

describe("Auth API - Registration", () => {
  it("successfully registers a new user with valid details", async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const req = new Request("https://order-management-raftlabs-one.vercel.app/api/auth/register", {
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
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.email).toBe(uniqueEmail);
    expect(data.name).toBe("Test Customer");
    expect(data.role).toBe("USER");
    expect(data.password).toBeUndefined();
  });

  it("fails when passwords do not match", async () => {
    const req = new Request("https://order-management-raftlabs-one.vercel.app/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Customer",
        email: "mismatch@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  it("fails when email is already registered", async () => {
    const email = "user@fooddash.com"; // seeded demo user
    const req = new Request("https://order-management-raftlabs-one.vercel.app/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Duplicate User",
        email,
        password: "password123",
        confirmPassword: "password123",
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("already exists");
  });
});
