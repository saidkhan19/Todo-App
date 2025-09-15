import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useGridCellSelector } from "../../store";
import GridCell from "./GridCell";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("../../store", () => ({
  useGridCellSelector: vi.fn(),
}));

vi.mock("../TaskGridItem/TaskGridItem", () => ({
  default: ({ row, column, item }) => (
    <div
      data-testid="task-grid-item"
      data-row={row}
      data-column={column}
      data-item-id={item.id}
    />
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("GridCell", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockUseGridCellSelector = vi.mocked(useGridCellSelector);

  const mockItems = [];
  beforeEach(() => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: mockItems });
  });

  it("renders the GridCell with correct attributes", () => {
    mockUseGridCellSelector.mockReturnValue([]);

    render(
      <GridCell row={0} column={0} ariaRowIndex={1} ariaColumnIndex={1} />
    );

    const cell = screen.queryByRole("gridcell");

    expect(cell).toHaveAttribute("data-row", "0");
    expect(cell).toHaveAttribute("data-column", "0");
    expect(cell).toHaveAttribute("aria-rowindex", "1");
    expect(cell).toHaveAttribute("aria-colindex", "1");
  });

  it("calls useGridCellSelector with correct arguments", () => {
    mockUseGridCellSelector.mockReturnValue([]);

    expect(mockUseGridCellSelector).not.toHaveBeenCalled();

    render(
      <GridCell row={5} column={5} ariaRowIndex={6} ariaColumnIndex={6} />
    );

    expect(mockUseGridCellSelector).toHaveBeenCalledWith(5, 5, mockItems);
  });

  it("renders only the placeholder when the cell contains only the placeholder", () => {
    mockUseGridCellSelector.mockReturnValue(["PLACEHOLDER"]);

    render(
      <GridCell row={5} column={5} ariaRowIndex={6} ariaColumnIndex={6} />
    );

    expect(screen.queryByTestId("placeholder")).toBeInTheDocument();
    expect(screen.queryByTestId("task-grid-item")).not.toBeInTheDocument();
  });

  it("renders only the grid items when the cell contains only the grid items", () => {
    mockUseGridCellSelector.mockReturnValue([
      { id: "item-1" },
      { id: "item-2" },
    ]);

    render(
      <GridCell row={5} column={5} ariaRowIndex={6} ariaColumnIndex={6} />
    );

    expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("task-grid-item")).toHaveLength(2);
  });

  it("renders both the grid items and the placeholder", () => {
    mockUseGridCellSelector.mockReturnValue([
      "PLACEHOLDER",
      { id: "item-1" },
      { id: "item-2" },
    ]);

    render(
      <GridCell row={5} column={5} ariaRowIndex={6} ariaColumnIndex={6} />
    );

    expect(screen.queryByTestId("placeholder")).toBeInTheDocument();
    expect(screen.queryAllByTestId("task-grid-item")).toHaveLength(2);
  });

  it("passes correct props to the grid items", () => {
    mockUseGridCellSelector.mockReturnValue([{ id: "item-1" }]);

    render(
      <GridCell row={5} column={5} ariaRowIndex={6} ariaColumnIndex={6} />
    );

    const gridItem = screen.queryByTestId("task-grid-item");

    expect(gridItem.dataset.row).toBe("5");
    expect(gridItem.dataset.column).toBe("5");
    expect(gridItem.dataset.itemId).toBe("item-1");
  });
});
