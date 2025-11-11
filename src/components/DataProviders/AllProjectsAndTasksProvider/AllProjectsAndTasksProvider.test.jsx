import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { useAllProjectsAndTasksContext } from "./context";
import AllProjectsAndTasksProvider from "./AllProjectsAndTasksProvider";
import { useAllProjectsAndTasks } from "@/hooks/queries";
import { mockItems } from "@/mocks/items";

vi.mock("@/hooks/queries", async () => ({
  useAllProjectsAndTasks: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ onContextValue }) => {
  const contextValue = useAllProjectsAndTasksContext();

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("AllProjectsAndTasksProvider", () => {
  const mockedAllUseProjectsAndTasks = vi.mocked(useAllProjectsAndTasks);

  it("shows all state values correctly", () => {
    mockedAllUseProjectsAndTasks.mockReturnValue([mockItems, false, null]);

    let contextValue;
    render(
      <AllProjectsAndTasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </AllProjectsAndTasksProvider>
    );

    expect(contextValue.items).toEqual(mockItems);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toBeNull();
  });

  it("passes down error state & resets items to an empty array", () => {
    const error = { message: "Error" };
    mockedAllUseProjectsAndTasks.mockReturnValue([null, false, error]);

    let contextValue;
    render(
      <AllProjectsAndTasksProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </AllProjectsAndTasksProvider>
    );

    expect(contextValue.items).toEqual([]);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toEqual(error);
  });
});
