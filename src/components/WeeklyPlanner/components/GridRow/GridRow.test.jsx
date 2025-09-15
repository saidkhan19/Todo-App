import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import GridRow from "./GridRow";

vi.mock("../GridCell/GridCell", () => ({
  default: ({ row, column, ariaRowIndex, ariaColumnIndex }) => (
    <div
      role="gridcell"
      data-row={row}
      data-column={column}
      aria-rowindex={ariaRowIndex}
      aria-colindex={ariaColumnIndex}
    />
  ),
}));

describe("GridRow", () => {
  it("correctly renders the row", () => {
    render(<GridRow row={0} ariaRowIndex={1} />);

    const rowEl = screen.queryByRole("row");

    expect(rowEl).toBeInTheDocument();
    expect(rowEl).toHaveAttribute("aria-rowindex", "1");
  });

  it("renders 7 cell in the row", () => {
    render(<GridRow row={0} ariaRowIndex={1} />);

    const rowEl = screen.queryByRole("row");

    expect(within(rowEl).queryAllByRole("gridcell")).toHaveLength(7);
  });

  it("passes correct data props to the GridCell component", () => {
    render(<GridRow row={0} ariaRowIndex={1} />);

    const cells = screen.queryAllByRole("gridcell");

    cells.forEach((cell, index) => {
      expect(cell.dataset.row).toBe("0");
      expect(cell.dataset.column).toBe(String(index));
    });
  });

  it("passes correct ARIA props to the GridCell component", () => {
    render(<GridRow row={5} ariaRowIndex={10} />);

    const cells = screen.queryAllByRole("gridcell");

    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute("aria-rowindex", "10");
      expect(cell).toHaveAttribute("aria-colindex", String(index + 1));
    });
  });
});
