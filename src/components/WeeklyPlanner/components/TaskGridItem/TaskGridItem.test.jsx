import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import useDragHandlers from "../../hooks/useDragHandlers";
import TaskGridItem from "./TaskGridItem";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("../../hooks/useDragHandlers", () => ({
  default: vi.fn(),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      layoutId,
      drag,
      dragSnapToOrigin,
      dragMomentum,
      onDragStart,
      onDragEnd,
      style,
    }) => (
      <div
        data-testid="motion-div"
        data-layout-id={layoutId}
        data-drag={drag}
        data-drag-snap-to-origin={dragSnapToOrigin}
        data-drag-momentum={dragMomentum}
        style={style}
      >
        {children}

        <button data-testid="on-drag-start" onClick={onDragStart} />
        <button data-testid="on-drag-end" onClick={onDragEnd} />
      </div>
    ),
  },
}));

vi.mock("@/lib/Tooltip", () => ({
  default: ({ renderOpener, renderContent, disabled }) => (
    <div data-testid="tooltip" data-disabled={disabled}>
      <div data-testid="opener">{renderOpener({ testProp: true })}</div>
      <div data-testid="content">{renderContent()}</div>
    </div>
  ),
  TooltipContent: ({ children }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

vi.mock("./ProjectInfo", () => ({
  default: ({ item, testProp }) => (
    <div
      data-testid="project-info"
      data-item={item.id}
      data-test-prop={testProp}
    />
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("TaskGridItem", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockUseDragHandlers = vi.mocked(useDragHandlers);

  const mockDragHandlers = {
    isDragging: false,
    handleDragStart: vi.fn(),
    handleDragEnd: vi.fn(),
  };

  const mockProps = {
    row: 1,
    column: 2,
    item: {
      id: "task-123",
      text: "Test task description",
    },
  };

  it("renders nothing when items is null/undefined", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: null });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    const { container } = render(<TaskGridItem {...mockProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders components when items are defined", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: ["item1", "item2"],
    });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(screen.queryByTestId("motion-div")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip")).toBeInTheDocument();
    expect(screen.queryByTestId("project-info")).toBeInTheDocument();
  });

  it("passes correct props to the motion component", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    const motionDiv = screen.getByTestId("motion-div");

    expect(motionDiv.dataset.layoutId).toBe(mockProps.item.id);
    expect(motionDiv.dataset.drag).toBe("true");
    expect(motionDiv.dataset.dragSnapToOrigin).toBe("true");
    expect(motionDiv.dataset.dragMomentum).toBe("false");
  });

  it("passes drag event handlers to the motion component", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(mockDragHandlers.handleDragStart).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("on-drag-start"));
    expect(mockDragHandlers.handleDragStart).toHaveBeenCalled();

    expect(mockDragHandlers.handleDragEnd).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("on-drag-end"));
    expect(mockDragHandlers.handleDragEnd).toHaveBeenCalled();
  });

  it("applies correct styles to the motion component when not dragging", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("motion-div")).toHaveStyle({
      pointerEvents: "auto",
    });
  });

  it("applies correct styles to the motion component when dragging", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue({
      ...mockDragHandlers,
      isDragging: true,
    });

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("motion-div")).toHaveStyle({
      pointerEvents: "none",
    });
  });

  it("calls useDragHandlers with correct parameters", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(mockUseDragHandlers).toHaveBeenCalledWith(
      mockProps.row,
      mockProps.column,
      mockProps.item,
      ["item1"]
    );
  });

  it("enables the tooltip when not dragging", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("tooltip").dataset.disabled).toBe("false");
  });

  it("disables the tooltip when dragging", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue({
      ...mockDragHandlers,
      isDragging: true,
    });

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("tooltip").dataset.disabled).toBe("true");
  });

  it("passes correct item to ProjectInfo component", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("project-info").dataset.item).toBe(
      mockProps.item.id
    );
  });

  it("forwards props from the Tooltip to ProjectInfo", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: ["item1"] });
    mockUseDragHandlers.mockReturnValue(mockDragHandlers);

    render(<TaskGridItem {...mockProps} />);

    expect(screen.getByTestId("project-info").dataset.testProp).toBe("true");
  });
});
