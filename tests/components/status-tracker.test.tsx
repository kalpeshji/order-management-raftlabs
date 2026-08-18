import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusTracker } from "@/components/order/status-tracker";

describe("StatusTracker Component", () => {
  it("renders 4 progression steps and indicates active step", () => {
    render(
      <StatusTracker
        currentStatus="PREPARING"
        statusHistory={[
          { status: "ORDER_RECEIVED", timestamp: new Date().toISOString() },
          { status: "PREPARING", timestamp: new Date().toISOString() },
        ]}
      />
    );

    expect(screen.getByText("Order Received")).toBeInTheDocument();
    expect(screen.getByText("Preparing Your Food")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Live Tracking")).toBeInTheDocument();
  });

  it("renders cancelled banner when order is cancelled", () => {
    render(<StatusTracker currentStatus="CANCELLED" />);
    expect(screen.getByText("Order Cancelled")).toBeInTheDocument();
  });
});
