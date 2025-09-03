import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { useProjectsAndTasksContext } from "./context";
import ProjectsAndTasksProvider from "./ProjectsAndTasksProvider";
import { mockItems } from "@/mocks/items";
import { useProjectsAndTasks } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useProjectsAndTasks: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ onContextValue }) => {
  const contextValue = useProjectsAndTasksContext();

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("ProjectsAndTasksProvider", () => {
  const mockedUseProjectsAndTasks = vi.mocked(useProjectsAndTasks);

  it("shows all state values correctly", () => {
    mockedUseProjectsAndTasks.mockReturnValue([mockItems, false, null]);

    let contextValue;
    render(
      <ProjectsAndTasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </ProjectsAndTasksProvider>
    );

    expect(contextValue.items).toEqual(mockItems);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toBeNull();
  });

  it("passes down error state & resets items to an empty array", () => {
    const error = { message: "Error" };
    mockedUseProjectsAndTasks.mockReturnValue([null, false, error]);

    let contextValue;
    render(
      <ProjectsAndTasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </ProjectsAndTasksProvider>
    );

    expect(contextValue.items).toEqual([]);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toEqual(error);
  });
});
