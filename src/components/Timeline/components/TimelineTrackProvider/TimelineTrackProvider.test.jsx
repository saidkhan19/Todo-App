import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { useTimelineTrackContext } from "../../context";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { mockItems } from "@/mocks/items";
import { CELL_WIDTH, MIN_TRACK_HEIGHT } from "../../consts";
import { useMotionValue } from "motion/react";
import { getToday } from "@/utils/date";
import TimelineTrackProvider from "./TimelineTrackProvider";

vi.mock("motion/react", async () => ({
  useMotionValue: vi.fn(),
}));

vi.mock("@/utils/date", async () => {
  const mod = await vi.importActual("@/utils/date");
  const mockGetToday = vi.fn();
  return {
    ...mod,
    getToday: mockGetToday,
  };
});

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

const mockElement = {
  clientWidth: 100,
};

const Wrapper = ({ children }) => {
  return <TimelineTrackProvider>{children}</TimelineTrackProvider>;
};

const TestComponent = ({ onContextValue }) => {
  const contextValue = useTimelineTrackContext();

  // Call the callback with context value so test can access it
  onContextValue(contextValue);

  // Register ref to a mock container element
  contextValue.containerRef.current = mockElement;
  return <div data-testid="test-component">Test</div>;
};

const mockX = {};
beforeEach(() => {
  vi.mocked(useProjectsAndTasksContext).mockReturnValue({
    items: mockItems,
    loading: false,
    error: null,
  });
  vi.mocked(useMotionValue).mockReturnValue(mockX);
  vi.mocked(getToday).mockReturnValue(new Date("2025-05-01"));
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineTrackProvider", () => {
  it("provides correct default values", () => {
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

    expect(contextValue.containerRef).toEqual(
      expect.objectContaining({ current: mockElement })
    );
    expect(contextValue.x).toBe(mockX);
    expect(contextValue.baseDate).toEqual(new Date("2025-05-01"));
    expect(contextValue.trackHeight).toBe(MIN_TRACK_HEIGHT);
  });

  it("correctly computes container width & track size", () => {
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

    expect(contextValue.containerWidth).toEqual(mockElement.clientWidth);
    expect(contextValue.trackSize).toEqual(
      Math.trunc(mockElement.clientWidth / CELL_WIDTH)
    );
  });
});
