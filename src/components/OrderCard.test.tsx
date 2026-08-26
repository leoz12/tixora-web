import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/render";
import OrderCard from "@/components/OrderCard";
import { Order } from "@/types";

const order: Order = {
  order_id: "ord_1",
  event_id: "evt_1",
  event_title: "Jazz Night",
  event_image: "https://example.com/jazz.jpg",
  quantity: 2,
  total_price: 300000,
  status: "paid",
  ticket_reference: "TKT-001",
  purchased_at: "2026-08-01T10:00:00.000Z",
};

describe("OrderCard", () => {
  it("links to the order detail page", () => {
    renderWithIntl(<OrderCard order={order} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/orders/ord_1");
  });

  it("renders the event title, quantity, and formatted total price", () => {
    renderWithIntl(<OrderCard order={order} />);

    expect(screen.getByText("Jazz Night")).toBeInTheDocument();
    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(screen.getByText("Rp 300.000")).toBeInTheDocument();
  });

  it("renders the translated status badge", () => {
    renderWithIntl(<OrderCard order={order} />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders a different status label for a pending order", () => {
    renderWithIntl(<OrderCard order={{ ...order, status: "pending" }} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
