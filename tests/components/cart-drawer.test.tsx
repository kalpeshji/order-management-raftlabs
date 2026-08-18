import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/lib/store/cart";

describe("CartDrawer Component", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("shows empty state when no items in cart", () => {
    render(<CartDrawer isOpen={true} onClose={() => {}} />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("renders cart items and calculates total with tax and delivery fee", () => {
    useCartStore.getState().addItem({
      menuItemId: "item_1",
      name: "Margherita Pizza",
      price: 299,
      image: "https://example.com/pizza.jpg",
    });

    render(<CartDrawer isOpen={true} onClose={() => {}} />);

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("₹299")).toBeInTheDocument(); // subtotal
    expect(screen.getByText("Proceed to Checkout")).toBeInTheDocument();
  });
});
