import { afterEach, describe, expect, it, vi } from "vitest";
import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskExpansionContext, TasksContext } from "../../context";
import ItemCard from "./ItemCard";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");

  const mockTasksContext = {
    getChildren: vi.fn(() => []),
  };

  const mockTaskExpansionContext = {
    isExpanded: vi.fn(() => false),
    toggleExpandedTask: vi.fn(),
    isHighlighted: vi.fn(() => false),
  };

  return {
    ...mod,
    useContext: vi.fn((ctx) => {
      if (ctx === TasksContext) return mockTasksContext;
      if (ctx === TaskExpansionContext) return mockTaskExpansionContext;
    }),
  };
});

vi.mock("@/hooks/useWindowSize", async () => ({
  default: vi.fn(() => "desktop"),
}));

vi.mock("../ProjectItem/ProjectItem", async () => ({
  default: () => <div data-testid="project-item" />,
}));

vi.mock("../TaskItem/TaskItem", async () => ({
  default: () => <div data-testid="task-item" />,
}));

vi.mock("../TaskGroup/TaskGroup", async () => ({
  default: () => <div data-testid="task-group" />,
}));

afterEach(() => {
  vi.resetAllMocks();
});

const mockItem = {
  id: "item",
  type: "project",
  level: 0,
  palette: "purple",
};

const mockChildren = [
  { id: "item-1", type: "task", level: 1 },
  { id: "item-2", type: "task", level: 1 },
  { id: "item-3", type: "task", level: 1 },
];

describe("ItemCard", () => {
  const { getChildren } = useContext(TasksContext);
  const { isExpanded, toggleExpandedTask, isHighlighted } =
    useContext(TaskExpansionContext);

  const mockGetChildren = vi.mocked(getChildren);
  const mockIsExpanded = vi.mocked(isExpanded);
  const mockToggleExpandedTask = vi.mocked(toggleExpandedTask);
  const mockIsHighlighted = vi.mocked(isHighlighted);

  it("renders ProjectItem when type is 'project'", () => {
    render(<ItemCard item={mockItem} />);

    expect(screen.queryByTestId("project-item")).toBeInTheDocument();
    expect(screen.queryByTestId("task-item")).not.toBeInTheDocument();
  });

  it("renders TaskItem when type is 'task'", () => {
    render(<ItemCard item={{ ...mockItem, type: "task" }} />);

    expect(screen.queryByTestId("task-item")).toBeInTheDocument();
    expect(screen.queryByTestId("project-item")).not.toBeInTheDocument();
  });

  it("renders ExpandButton when item has children", () => {
    mockGetChildren.mockReturnValue(mockChildren);

    render(<ItemCard item={mockItem} />);

    expect(
      screen.queryByRole("button", { name: "Раскрыть" })
    ).toBeInTheDocument();
  });

  it("does not render ExpandButton when item has no children", () => {
    render(<ItemCard item={mockItem} />);

    expect(
      screen.queryByRole("button", { name: "Раскрыть" })
    ).not.toBeInTheDocument();
  });

  it("does not render TaskGroup when collapsed", () => {
    mockGetChildren.mockReturnValue(mockChildren);

    render(<ItemCard item={mockItem} />);

    expect(screen.queryByTestId("task-group")).not.toBeInTheDocument();
  });

  it("renders TaskGroup when expanded", () => {
    mockGetChildren.mockReturnValue(mockChildren);
    mockIsExpanded.mockReturnValue(true);

    render(<ItemCard item={mockItem} />);

    expect(screen.queryByTestId("task-group")).toBeInTheDocument();
  });

  it("calls toggleExpandedTask when 'expand' button is clicked", async () => {
    mockGetChildren.mockReturnValue(mockChildren);

    const user = userEvent.setup();
    render(<ItemCard item={mockItem} />);

    expect(mockToggleExpandedTask).not.toHaveBeenCalled();

    await user.click(screen.queryByRole("button", { name: "Раскрыть" }));

    expect(mockToggleExpandedTask).toHaveBeenCalledWith(mockItem.id);
  });

  it("applies outline when item is highlighted", () => {
    mockIsHighlighted.mockReturnValue(true);
    render(<ItemCard item={mockItem} />);

    const el = document.getElementById(mockItem.id);

    expect(el).toHaveStyle({
      border: "none",
      outline: "3px solid var(--clr-accent)",
    });
  });
});
