import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

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
  getBoundingClientRect: () => ({ width: 100 }),
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

let mockObserver;
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    mockObserver = this;
  }
  observe(target) {
    // Simulate initial observation
    this.target = target;
    this.callback?.([
      {
        target,
        contentRect: target.getBoundingClientRect(),
      },
    ]);
  }
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserver;

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

    expect(contextValue.containerWidth).toEqual(
      mockElement.getBoundingClientRect().width
    );
    expect(contextValue.trackSize).toEqual(
      Math.trunc(mockElement.getBoundingClientRect().width / CELL_WIDTH)
    );
  });

  it("updates containerWidth when resized", () => {
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

    expect(contextValue.containerWidth).toEqual(100);

    act(() => {
      mockObserver.callback([{ contentRect: { width: 50 } }]);
    });

    expect(contextValue.containerWidth).toEqual(50);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(
      <Wrapper>
        <TestComponent onContextValue={() => {}} />
      </Wrapper>
    );

    expect(mockObserver.disconnect).not.toHaveBeenCalled();

    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
