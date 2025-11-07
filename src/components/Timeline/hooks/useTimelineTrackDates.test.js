import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { throttleCancel } from "throttle-debounce";
import { useTimelineTrackContext } from "../context";
import useTimelineTrackDates from "./useTimelineTrackDates";
import { BUFFER, CELL_WIDTH } from "../consts";
import { generateDates, getOffsetDate } from "@/utils/date";

vi.mock("throttle-debounce", async () => {
  const throttleCancel = vi.fn();
  const throttle = vi.fn((_ms, fn) => {
    fn.cancel = throttleCancel;
    return fn;
  });

  return { throttle, throttleCancel };
});

vi.mock("../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("@/utils/date", async () => ({
  generateDates: vi.fn(),
  getOffsetDate: vi.fn(),
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
  trackSize: 10,
};

const mockDates = [
  new Date("2025-05-01"),
  new Date("2025-05-02"),
  new Date("2025-05-03"),
];

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockGetOffsetDate = vi.mocked(getOffsetDate);
const mockGenerateDates = vi.mocked(generateDates);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockGetOffsetDate.mockReturnValue(10);
  mockGenerateDates.mockReturnValue(mockDates);
  mockUnsubscribe.mockClear();
  throttleCancel.mockClear();
});

afterEach(() => {
  mockX.event = null;
  mockX.handler = null;
  vi.resetAllMocks();
});

describe("useTimelineTrackDates", () => {
  it("returns correct initial offset and dates", () => {
    const { result } = renderHook(useTimelineTrackDates);

    expect(result.current.offset).toBe(-BUFFER);
    expect(result.current.dates).toBe(mockDates);
  });

  it("registers a change event handler on scroll", () => {
    expect(mockX.on).not.toHaveBeenCalled();
    renderHook(useTimelineTrackDates);

    expect(mockX.on).toHaveBeenCalled();
    expect(mockX.event).toBe("change");
    expect(mockX.handler).toBeInstanceOf(Function);
  });

  it("correctly updates offset on scroll change", () => {
    const { result } = renderHook(useTimelineTrackDates);

    expect(result.current.offset).toBe(-BUFFER);

    act(() => {
      // Scroll left one cell
      mockX.handler(-CELL_WIDTH);
    });

    expect(result.current.offset).toBe(-BUFFER + 1);
  });

  it("clears subscriptions on unmount", () => {
    const { unmount } = renderHook(useTimelineTrackDates);

    expect(mockUnsubscribe).not.toHaveBeenCalled();
    expect(mockX.handler.cancel).not.toHaveBeenCalled();

    unmount();

    // Unsubscribe from scroll change event
    expect(mockUnsubscribe).toHaveBeenCalled();
    // Unsubscribe from throttle
    expect(mockX.handler.cancel).toHaveBeenCalled();
  });
});
