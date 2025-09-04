import { afterEach, describe, expect, it, vi } from "vitest";
import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskExpansionContext } from "../../context";
import ItemCard from "./ItemCard";
import { mockItems, mockProjectItem, mockTaskItem } from "@/mocks/items";
import { getItemById } from "@/utils/dataTransforms";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");

  const mockTaskExpansionContext = {
    isExpanded: vi.fn(() => false),
    toggleExpandedTask: vi.fn(),
    isHighlighted: vi.fn(() => false),
  };

  return {
    ...mod,
    useContext: vi.fn((ctx) => {
      if (ctx === TaskExpansionContext) return mockTaskExpansionContext;
    }),
  };
});

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(() => ({
    items: mockItems,
  })),
}));

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

const mockItemWithChildren = getItemById(mockItems, "project-1");
const mockItemWithoutChildren = getItemById(mockItems, "task-1");

describe("ItemCard", () => {
  const { isExpanded, toggleExpandedTask, isHighlighted } =
    useContext(TaskExpansionContext);

  const mockIsExpanded = vi.mocked(isExpanded);
  const mockToggleExpandedTask = vi.mocked(toggleExpandedTask);
  const mockIsHighlighted = vi.mocked(isHighlighted);

  it("renders ProjectItem when type is 'project'", () => {
    render(<ItemCard item={mockProjectItem} />);

    expect(screen.queryByTestId("project-item")).toBeInTheDocument();
    expect(screen.queryByTestId("task-item")).not.toBeInTheDocument();
  });

  it("renders TaskItem when type is 'task'", () => {
    render(<ItemCard item={mockTaskItem} />);

    expect(screen.queryByTestId("task-item")).toBeInTheDocument();
    expect(screen.queryByTestId("project-item")).not.toBeInTheDocument();
  });

  it("renders ExpandButton when item has children", () => {
    render(<ItemCard item={mockItemWithChildren} />);

    expect(
      screen.queryByRole("button", { name: "Раскрыть" })
    ).toBeInTheDocument();
  });

  it("does not render ExpandButton when item has no children", () => {
    render(<ItemCard item={mockItemWithoutChildren} />);

    expect(
      screen.queryByRole("button", { name: "Раскрыть" })
    ).not.toBeInTheDocument();
  });

  it("does not render TaskGroup when collapsed", () => {
    render(<ItemCard item={mockItemWithChildren} />);

    expect(screen.queryByTestId("task-group")).not.toBeInTheDocument();
  });

  it("renders TaskGroup when expanded", () => {
    mockIsExpanded.mockReturnValue(true);

    render(<ItemCard item={mockItemWithChildren} />);

    expect(screen.queryByTestId("task-group")).toBeInTheDocument();
  });

  it("calls toggleExpandedTask when 'expand' button is clicked", async () => {
    const user = userEvent.setup();
    render(<ItemCard item={mockItemWithChildren} />);

    expect(mockToggleExpandedTask).not.toHaveBeenCalled();

    await user.click(screen.queryByRole("button", { name: "Раскрыть" }));

    expect(mockToggleExpandedTask).toHaveBeenCalledWith(
      mockItemWithChildren.id
    );
  });

  it("applies outline when item is highlighted", () => {
    mockIsHighlighted.mockReturnValue(true);
    render(<ItemCard item={mockItemWithChildren} />);

    const el = document.getElementById(mockItemWithChildren.id);

    expect(el).toHaveStyle({
      border: "none",
      outline: "3px solid var(--clr-accent)",
    });
  });
});
