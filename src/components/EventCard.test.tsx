import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/render";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";

const baseEvent: Event = {
  id: "evt_1",
  title: "Jazz Night",
  description: "An evening of jazz.",
  event_date: "2026-09-01T19:00:00.000Z",
  location: "Jakarta",
  image_url: "https://example.com/jazz.jpg",
  price: 150000,
  admin_fee: 5000,
  total_tickets: 100,
  available_tickets: 50,
  category_id: "cat_1",
  category: {
    id: "cat_1",
    name: "Music",
    slug: "music",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};

describe("EventCard", () => {
  it("shows a Book now link to the event when the buyer can purchase", () => {
    renderWithIntl(<EventCard event={baseEvent} canPurchase />);

    const link = screen.getByRole("link", { name: "Book Now" });
    expect(link).toHaveAttribute("href", "/events/evt_1");
    expect(screen.queryByText("Sold Out")).not.toBeInTheDocument();
    expect(screen.queryByText("Selling Fast")).not.toBeInTheDocument();
  });

  it("shows a sign-in link instead of a book link when the buyer isn't authenticated", () => {
    renderWithIntl(<EventCard event={baseEvent} canPurchase={false} />);

    const link = screen.getByRole("link", { name: "Sign in to Book" });
    expect(link).toHaveAttribute("href", "/login");
    expect(
      screen.queryByRole("link", { name: "Book Now" }),
    ).not.toBeInTheDocument();
  });

  it("flags an event as selling fast when under 15% of tickets remain", () => {
    const event = { ...baseEvent, total_tickets: 100, available_tickets: 10 };
    renderWithIntl(<EventCard event={event} canPurchase />);

    expect(screen.getByText("Selling Fast")).toBeInTheDocument();
  });

  it("does not flag an event as selling fast at exactly 15% remaining", () => {
    const event = { ...baseEvent, total_tickets: 100, available_tickets: 15 };
    renderWithIntl(<EventCard event={event} canPurchase />);

    expect(screen.queryByText("Selling Fast")).not.toBeInTheDocument();
  });

  it("shows Sold Out and disables the CTA when there are no tickets left", () => {
    const event = { ...baseEvent, available_tickets: 0 };
    renderWithIntl(<EventCard event={event} canPurchase />);

    expect(screen.getAllByText("Sold Out")).toHaveLength(2); // badge + button
    expect(screen.getByRole("button", { name: "Sold Out" })).toBeDisabled();
    expect(screen.queryByRole("link", { name: "Book Now" })).not.toBeInTheDocument();
  });

  it("renders the formatted price", () => {
    renderWithIntl(<EventCard event={baseEvent} canPurchase />);
    expect(screen.getByText("Rp 150.000")).toBeInTheDocument();
  });
});
