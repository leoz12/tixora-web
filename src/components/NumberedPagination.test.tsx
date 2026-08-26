import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberedPagination from "@/components/NumberedPagination";

const labels = { prevLabel: "Prev", nextLabel: "Next" };

describe("NumberedPagination", () => {
  it("renders one button per page", () => {
    render(
      <NumberedPagination page={2} totalPages={3} onPageChange={jest.fn()} {...labels} />,
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("marks the current page button with aria-current=page", () => {
    render(
      <NumberedPagination page={2} totalPages={3} onPageChange={jest.fn()} {...labels} />,
    );

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("disables Prev on the first page and Next on the last page", () => {
    render(
      <NumberedPagination page={1} totalPages={3} onPageChange={jest.fn()} {...labels} />,
    );

    expect(screen.getByRole("button", { name: /Prev/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/ })).not.toBeDisabled();
  });

  it("calls onPageChange with the clicked page number", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <NumberedPagination page={1} totalPages={3} onPageChange={onPageChange} {...labels} />,
    );

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with page - 1 when Prev is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <NumberedPagination page={2} totalPages={3} onPageChange={onPageChange} {...labels} />,
    );

    await user.click(screen.getByRole("button", { name: /Prev/ }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with page + 1 when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <NumberedPagination page={2} totalPages={3} onPageChange={onPageChange} {...labels} />,
    );

    await user.click(screen.getByRole("button", { name: /Next/ }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
