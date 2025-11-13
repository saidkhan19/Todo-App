import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { useDefaultProjectContext } from "./context";
import DefaultProjectProvider from "./DefaultProjectProvider";
import { mockProjectItem } from "@/mocks/items";
import { useDefaultProject } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useDefaultProject: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ onContextValue }) => {
  const contextValue = useDefaultProjectContext();

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  return <div data-testid="test-component">Test</div>;
};

describe("DefaultProjectProvider", () => {
  const mockedUseDefaultProject = vi.mocked(useDefaultProject);
  const mockDefaultProject = { ...mockProjectItem, name: "defaultProjectName" };

  it("shows all state values correctly", () => {
    mockedUseDefaultProject.mockReturnValue([mockDefaultProject, false, null]);

    let contextValue;
    render(
      <DefaultProjectProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </DefaultProjectProvider>
    );

    expect(contextValue.defaultProject).toEqual(mockDefaultProject);
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toBeNull();
  });

  it("passes down error state", () => {
    const error = { message: "Error" };
    mockedUseDefaultProject.mockReturnValue([null, false, error]);

    let contextValue;
    render(
      <DefaultProjectProvider>
        <TestComponent
          onContextValue={(value) => {
            contextValue = value;
          }}
        />
      </DefaultProjectProvider>
    );

    expect(contextValue.defaultProject).toBeNull();
    expect(contextValue.loading).toEqual(false);
    expect(contextValue.error).toEqual(error);
  });
});
