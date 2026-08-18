import { describe, it, expect } from "vitest";
import { GET as menuHandler } from "@/app/api/menu/route";

describe("Menu API", () => {
  it("returns list of available menu items", async () => {
    const req = new Request("http://localhost:3000/api/menu");
    const res = await menuHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);

    const firstItem = data.items[0];
    expect(firstItem).toHaveProperty("id");
    expect(firstItem).toHaveProperty("name");
    expect(firstItem).toHaveProperty("price");
    expect(firstItem).toHaveProperty("image");
    expect(firstItem).toHaveProperty("category");
  });

  it("filters menu items by category", async () => {
    const req = new Request("http://localhost:3000/api/menu?category=PIZZA");
    const res = await menuHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.items.length).toBeGreaterThan(0);
    data.items.forEach((item: any) => {
      expect(item.category).toBe("PIZZA");
    });
  });
});
