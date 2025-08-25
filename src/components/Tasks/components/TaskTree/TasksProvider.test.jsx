import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useContext } from "react";

import { TasksContext } from "./context";
import TasksProvider from "./TasksProvider";
import { mockItems } from "@/mocks/items";
import { useProjectsAndTasks } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useProjectsAndTasks: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ onContextValue }) => {
  const contextValue = useContext(TasksContext);

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("TasksProvider", () => {
  const mockedUseProjectsAndTasks = vi.mocked(useProjectsAndTasks);

  it("shows all state values correctly", () => {
    mockedUseProjectsAndTasks.mockReturnValue([mockItems, false, null]);

    let contextValue;
    render(
      <TasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </TasksProvider>
    );

    expect(contextValue.items).toEqual(mockItems);
    expect(contextValue.loadingItems).toEqual(false);
    expect(contextValue.errorItems).toBeNull();
  });

  it("passes down error state & resets items to an empty array", () => {
    const error = { message: "Error" };
    mockedUseProjectsAndTasks.mockReturnValue([null, false, error]);

    let contextValue;
    render(
      <TasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </TasksProvider>
    );

    expect(contextValue.items).toEqual([]);
    expect(contextValue.loadingItems).toEqual(false);
    expect(contextValue.errorItems).toEqual(error);
  });

  it("handles item operations", () => {
    mockedUseProjectsAndTasks.mockReturnValue([mockItems, false, null]);

    let contextValue;
    render(
      <TasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </TasksProvider>
    );

    expect(contextValue.getRootItems()).toHaveLength(3);
    // Root level nesting
    expect(contextValue.getChildren("project-1")).toHaveLength(2);
    // Deep nesting
    expect(contextValue.getChildren("task-2")).toHaveLength(3);
    // Nonexistent item
    expect(contextValue.getChildren("nonexistent-item")).toEqual([]);

    expect(contextValue.getItemById("subtask-1")?.title).toBe(
      "Setup React project"
    );
  });
});
