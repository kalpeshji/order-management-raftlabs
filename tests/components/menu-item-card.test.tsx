import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { useCartStore } from "@/lib/store/cart";

const mockItem = {
  id: "item_test_1",
  name: "Truffle Mushroom Pizza",
  description: "Wild mushrooms with truffle oil and mozzarella",
  price: 499,
  image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
  category: "PIZZA",
};

describe("MenuItemCard Component", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders item name, price in INR, and description", () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText("Truffle Mushroom Pizza")).toBeInTheDocument();
    expect(screen.getByText("₹499")).toBeInTheDocument();
    expect(
      screen.getByText("Wild mushrooms with truffle oil and mozzarella")
    ).toBeInTheDocument();
  });

  it("adds item to cart and displays quantity controls", () => {
    render(<MenuItemCard item={mockItem} />);
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(screen.getByText("1 in cart")).toBeInTheDocument();
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });
});
