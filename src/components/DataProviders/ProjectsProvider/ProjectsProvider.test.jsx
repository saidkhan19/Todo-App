import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { useProjectsContext } from "./context";
import ProjectsProvider from "./ProjectsProvider";
import { mockItems } from "@/mocks/items";
import { useProjects } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useProjects: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ onContextValue }) => {
  const contextValue = useProjectsContext();

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("ProjectsProvider", () => {
  const mockedUseProjects = vi.mocked(useProjects);

  it("shows all state values correctly", () => {
    mockedUseProjects.mockReturnValue([mockItems, false, null]);

    let contextValue;
    render(
      <ProjectsProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </ProjectsProvider>
    );

    expect(contextValue.items).toEqual(mockItems);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toBeNull();
  });

  it("passes down error state & resets items to an empty array", () => {
    const error = { message: "Error" };
    mockedUseProjects.mockReturnValue([null, false, error]);

    let contextValue;
    render(
      <ProjectsProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </ProjectsProvider>
    );

    expect(contextValue.items).toEqual([]);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toEqual(error);
  });
});
