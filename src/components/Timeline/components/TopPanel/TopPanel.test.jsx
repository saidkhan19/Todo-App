import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { throttleCancel } from "throttle-debounce";
import { useTimelineTrackContext } from "../../context";
import useTimelineStore from "../../store";
import { mockStoreState } from "@/utils/test-utils";
import { formatDate, formatMonthYear } from "@/utils/format";
import { CELL_WIDTH } from "../../consts";
import TopPanel from "./TopPanel";

vi.mock("throttle-debounce", async () => {
  const throttleCancel = vi.fn();
  const throttle = vi.fn((_ms, fn) => {
    fn.cancel = throttleCancel;
    return fn;
  });

  return { throttle, throttleCancel };
});

vi.mock("../../store", async () => ({
  default: vi.fn(),
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

const mockUnsubscribe = vi.fn();

const mockX = {
  event: null,
  handler: null,
  on: vi.fn((event, fn) => {
    mockX.event = event;
    mockX.handler = fn;
    return mockUnsubscribe;
  }),
};

const mockTrackState = {
  x: mockX,
  baseDate: new Date("2025-05-01"),
};
const mockNoInteractionState = {
  activeItem: null,
  activeStartDate: null,
  activeEndDate: null,
};
const mockInteractionState = {
  activeItem: { id: "item-1" },
  activeStartDate: new Date("2025-05-01"),
  activeEndDate: new Date("2025-05-05"),
};

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockUnsubscribe.mockClear();
  throttleCancel.mockClear();
});

afterEach(() => {
  mockX.event = null;
  mockX.handler = null;
  vi.resetAllMocks();
});

describe("Timeline TopPanel", () => {
  it("renders correct text when not interacting", () => {
    mockStoreState(useTimelineStore, mockNoInteractionState);
    render(<TopPanel />);

    expect(
      screen.queryByText(formatMonthYear(mockTrackState.baseDate))
    ).toBeInTheDocument();
  });

  it("renders active dates when interacting", () => {
    mockStoreState(useTimelineStore, mockInteractionState);
    render(<TopPanel />);

    expect(
      screen.queryByText(formatMonthYear(mockTrackState.baseDate))
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(formatDate(mockInteractionState.activeStartDate))
    ).toBeInTheDocument();
    expect(
      screen.queryByText(formatDate(mockInteractionState.activeEndDate))
    ).toBeInTheDocument();
  });

  it("registers a change event handler on scroll", () => {
    mockStoreState(useTimelineStore, mockNoInteractionState);
    expect(mockX.on).not.toHaveBeenCalled();
    render(<TopPanel />);

    expect(mockX.on).toHaveBeenCalled();
    expect(mockX.event).toBe("change");
    expect(mockX.handler).toBeInstanceOf(Function);
  });

  it("correctly updates date on scroll", () => {
    mockStoreState(useTimelineStore, mockNoInteractionState);
    render(<TopPanel />);

    expect(
      screen.queryByText(formatMonthYear(new Date("2025-05-01")))
    ).toBeInTheDocument();

    act(() => {
      // Go from "2025-05-01" to "2025-04-30"
      // Scroll happens in the opposite direction
      mockX.handler(CELL_WIDTH);
    });

    expect(
      screen.queryByText(formatMonthYear(new Date("2025-04-30")))
    ).toBeInTheDocument();
  });

  it("clears subscriptions on unmount", () => {
    mockStoreState(useTimelineStore, mockNoInteractionState);
    const { unmount } = render(<TopPanel />);

    expect(mockUnsubscribe).not.toHaveBeenCalled();
    expect(mockX.handler.cancel).not.toHaveBeenCalled();

    unmount();

    // Unsubscribe from scroll chage event
    expect(mockUnsubscribe).toHaveBeenCalled();
    // Unsubscribe from throttle
    expect(mockX.handler.cancel).toHaveBeenCalled();
  });
});
