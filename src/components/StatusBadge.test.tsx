import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/render";
import StatusBadge from "@/components/StatusBadge";
import { Order } from "@/types";

describe("StatusBadge", () => {
  it.each<[Order["status"], string]>([
    ["paid", "Paid"],
    ["pending", "Pending"],
    ["expired", "Expired"],
    ["cancelled", "Cancelled"],
  ])("renders the translated label for status %s", (status, label) => {
    renderWithIntl(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
