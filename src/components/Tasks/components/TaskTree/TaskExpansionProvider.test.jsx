import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useContext } from "react";
import { useLocation } from "react-router";

import TasksProvider from "./TasksProvider";
import { mockItems } from "@/mocks/items";
import TaskExpansionProvider from "./TaskExpansionProvider";
import { TaskExpansionContext } from "./context";
import { useProjectsAndTasks } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useProjectsAndTasks: vi.fn(() => [mockItems, false, null]),
}));

vi.mock("react-router", async () => {
  const mod = await vi.importActual("react-router");
  return {
    ...mod,
    useLocation: vi.fn(() => ({ hash: "" })),
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

const Wrapper = ({ children }) => {
  return (
    <TasksProvider>
      <TaskExpansionProvider>{children}</TaskExpansionProvider>
    </TasksProvider>
  );
};

const TestComponent = ({ onContextValue }) => {
  const contextValue = useContext(TaskExpansionContext);

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("TaskExpansionProvider", () => {
  const mockedUseProjectsAndTasks = vi.mocked(useProjectsAndTasks);
  const mockedUseLocation = vi.mocked(useLocation);

  it("handles expanding operations", () => {
    let contextValue;
    render(
      <Wrapper>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </Wrapper>
    );

    // All items collapsed initially
    mockItems.forEach((item) => {
      expect(contextValue.isExpanded(item.id)).toBe(false);
    });

    // Expand
    act(() => {
      contextValue.toggleExpandedTask("project-1");
      contextValue.toggleExpandedTask("project-2");
      contextValue.toggleExpandedTask("task-2");
    });

    expect(contextValue.isExpanded("project-1")).toBe(true);
    expect(contextValue.isExpanded("project-2")).toBe(true);
    expect(contextValue.isExpanded("task-2")).toBe(true);
    expect(contextValue.isExpanded("task-1")).toBe(false);
    expect(contextValue.isExpanded("subtask-1")).toBe(false);

    // Collapse
    act(() => {
      contextValue.toggleExpandedTask("project-1");
    });

    expect(contextValue.isExpanded("project-1")).toBe(false);
    // Subtasks remember their state
    expect(contextValue.isExpanded("task-2")).toBe(true);
  });

  it("expands the tree of the selected task & highlights the task", () => {
    mockedUseLocation.mockReturnValue({ hash: "#subtask-1" });

    let contextValue;
    const { rerender } = render(
      <Wrapper>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </Wrapper>
    );

    // The tree is expanded
    expect(contextValue.isExpanded("project-1")).toBe(true);
    expect(contextValue.isExpanded("task-2")).toBe(true);
    expect(contextValue.isExpanded("subtask-1")).toBe(true);

    // Other items are collapsed
    expect(contextValue.isExpanded("project-2")).toBe(false);
    expect(contextValue.isExpanded("task-1")).toBe(false);
    expect(contextValue.isExpanded("subtask-2")).toBe(false);

    // Highlights the selected task
    expect(contextValue.isHighlighted("subtask-1")).toBe(true);
    // Does not highlight others
    expect(contextValue.isHighlighted("project-1")).toBe(false);
    expect(contextValue.isHighlighted("subtask-2")).toBe(false);

    // Change the selected task
    mockedUseLocation.mockReturnValue({ hash: "#task-3" });
    rerender(
      <Wrapper>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </Wrapper>
    );

    // The previous tree remains expanded
    expect(contextValue.isExpanded("project-1")).toBe(true);
    expect(contextValue.isExpanded("task-2")).toBe(true);
    expect(contextValue.isExpanded("subtask-1")).toBe(true);

    // New tree is expanded
    expect(contextValue.isExpanded("project-2")).toBe(true);
    expect(contextValue.isExpanded("task-3")).toBe(true);

    // Does not effect other items
    expect(contextValue.isExpanded("task-1")).toBe(false);
    expect(contextValue.isExpanded("task-4")).toBe(false);
    expect(contextValue.isExpanded("subtask-2")).toBe(false);

    // Highlighting item has changed
    expect(contextValue.isHighlighted("subtask-1")).toBe(false);
    expect(contextValue.isHighlighted("task-3")).toBe(true);
  });

  it("handles rerendering from loading state", () => {
    mockedUseProjectsAndTasks.mockReturnValue([null, true, null]);
    mockedUseLocation.mockReturnValue({ hash: "#subtask-1" });

    let contextValue;
    const { rerender } = render(
      <Wrapper>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </Wrapper>
    );

    // The tree has not loaded yet, so it is not expanded
    expect(contextValue.isExpanded("project-1")).toBe(false);
    expect(contextValue.isExpanded("task-2")).toBe(false);
    expect(contextValue.isExpanded("subtask-1")).toBe(false);

    mockedUseProjectsAndTasks.mockRestore();
    rerender(
      <Wrapper>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </Wrapper>
    );

    // The tree is expanded
    expect(contextValue.isExpanded("project-1")).toBe(true);
    expect(contextValue.isExpanded("task-2")).toBe(true);
    expect(contextValue.isExpanded("subtask-1")).toBe(true);

    // Other items are collapsed
    expect(contextValue.isExpanded("project-2")).toBe(false);
    expect(contextValue.isExpanded("task-1")).toBe(false);
    expect(contextValue.isExpanded("subtask-2")).toBe(false);
  });
});
