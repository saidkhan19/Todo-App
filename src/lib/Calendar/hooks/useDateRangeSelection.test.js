import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useDateRangeSelection from "./useDateRangeSelection";

vi.mock("../utils", async () => {
  const mod = await vi.importActual("../utils");
  return {
    ...mod,
    parseLocalDateString: vi.fn((dateString) => new Date(dateString)),
  };
});

const mockDateCell = {
  dataset: { date: "2025-01-10" },
  closest: vi.fn().mockReturnThis(),
};

// Mock container ref
const mockContainerRef = {
  current: {
    getBoundingClientRect: vi.fn().mockReturnValue({
      left: 100,
      right: 300,
    }),
  },
};

// Setup default props
const mockProps = {
  startDate: new Date("2025-01-10"),
  endDate: new Date("2025-01-20"),
  onChangeStartDate: vi.fn(),
  onChangeEndDate: vi.fn(),
  alignView: vi.fn(),
  setPreviousMonth: vi.fn(),
  setNextMonth: vi.fn(),
  containerRef: mockContainerRef,
};

beforeEach(() => {
  window.document.elementFromPoint = vi.fn().mockReturnValue(mockDateCell);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();

  // Restore the mock to its defaults
  mockDateCell.dataset.date = "2025-01-10";
  mockDateCell.closest.mockReturnThis();
});

describe("useDateRangeSelection", () => {
  describe("handlePointerDown", () => {
    it("does not set selecting when already selecting", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // First pointer down
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Second pointer down should be ignored
      act(() => {
        result.current.handlePointerDown({ clientX: 160, clientY: 160 });
      });

      // Should only call elementFromPoint once
      expect(window.document.elementFromPoint).toHaveBeenCalledTimes(1);
    });

    it("should enter selecting mode when clicking on a date", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Pointer move event is not handled
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });
      expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
      expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();

      // Pointer down
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Now it should be handled
      mockDateCell.dataset.date = "2025-01-01";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });
      expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
        new Date("2025-01-01")
      );
      expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
        new Date("2025-01-20")
      );
    });

    it("should not enter selecting mode when clicking outside date cells", () => {
      mockDateCell.closest.mockReturnValue(null);
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Pointer down
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Pointer move event is not handled
      mockDateCell.dataset.date = "2025-01-01";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });
      expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
      expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
    });
  });

  describe("handlePointerMove", () => {
    it("does not do anything when not in selecting mode", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });
      expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
      expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
    });

    it("updates the range when moving over valid date cell", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      mockDateCell.dataset.date = "2025-01-01";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });

      // Updates both ends
      expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
        new Date("2025-01-01")
      );
      expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
        new Date("2025-01-20")
      );
    });

    it("switches 'start' & 'end' when they are dragged beyond each other", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Grab the 'start'
      mockDateCell.dataset.date = "2025-01-10";
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move it beyond the 'end'
      mockDateCell.dataset.date = "2025-01-30";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });

      // Updates both ends
      expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
        new Date("2025-01-20")
      );
      expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
        new Date("2025-01-30")
      );

      // Grab the 'end'. NOTICE that actual dates were not changed.
      mockDateCell.dataset.date = "2025-01-20";
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move it beyond the 'start'
      mockDateCell.dataset.date = "2025-01-01";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });

      // Updates both ends
      expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
        new Date("2025-01-01")
      );
      expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
        new Date("2025-01-10")
      );
    });
  });

  describe("handlePointerUp", () => {
    it("cancels selection mode", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Pointer down
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Pointer up
      act(() => {
        result.current.handlePointerUp();
      });

      // Move events are ignored
      mockDateCell.dataset.date = "2025-01-01";
      act(() => {
        result.current.handlePointerMove({ clientX: 150, clientY: 150 });
      });
      expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
      expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
    });

    it("calls alignView with the selected end", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Grab the 'start'
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Pointer up
      act(() => {
        result.current.handlePointerUp();
      });

      // Align view called with the start date
      expect(mockProps.alignView).toHaveBeenCalledWith(new Date("2025-01-10"));

      // Grab the 'end'
      mockDateCell.dataset.date = "2025-01-20";
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Pointer up
      act(() => {
        result.current.handlePointerUp();
      });

      // Align view called with the end date
      expect(mockProps.alignView).toHaveBeenCalledWith(new Date("2025-01-20"));
    });
  });

  describe("handleEdgeNavigation", () => {
    it("navigates to previous month when pointer is near left edge", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Start selecting
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move to left edge
      act(() => {
        result.current.handlePointerMove({ clientX: 50, clientY: 150 });
      });

      // Fast forward timers
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockProps.setPreviousMonth).toHaveBeenCalled();
    });

    it("navigates to next month when pointer is near right edge", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Start selecting
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move to right edge
      act(() => {
        result.current.handlePointerMove({ clientX: 350, clientY: 150 });
      });

      // Fast forward timers
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockProps.setNextMonth).toHaveBeenCalled();
    });

    it("continues navigation with longer intervals", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Start selecting
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move to right edge
      act(() => {
        result.current.handlePointerMove({ clientX: 350, clientY: 150 });
      });

      // Fast forward initial timer
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockProps.setNextMonth).toHaveBeenCalledTimes(1);

      // Fast forward subsequent timer
      act(() => {
        vi.advanceTimersByTime(1300);
      });

      expect(mockProps.setNextMonth).toHaveBeenCalledTimes(2);
    });

    it("clears navigation timer when pointer returns to grid", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Start selecting
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move to right edge
      act(() => {
        result.current.handlePointerMove({ clientX: 350, clientY: 150 });
      });

      // Move back to grid
      act(() => {
        result.current.handlePointerMove({ clientX: 200, clientY: 150 });
      });

      // Fast forward timers
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockProps.setNextMonth).not.toHaveBeenCalled();
    });

    it("clears navigation timer on pointer up", () => {
      const { result } = renderHook(() => useDateRangeSelection(mockProps));

      // Start selecting
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      // Move to right edge
      act(() => {
        result.current.handlePointerMove({ clientX: 350, clientY: 150 });
      });

      // Pointer up
      act(() => {
        result.current.handlePointerUp();
      });

      // Fast forward timers
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockProps.setNextMonth).not.toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should clear timers on component unmount", () => {
      const { result, unmount } = renderHook(() =>
        useDateRangeSelection(mockProps)
      );

      // Start selecting and trigger navigation
      act(() => {
        result.current.handlePointerDown({ clientX: 150, clientY: 150 });
      });

      act(() => {
        result.current.handlePointerMove({ clientX: 50, clientY: 150 });
      });

      // Unmount component
      unmount();

      // Verify timers are cleared
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockProps.setPreviousMonth).not.toHaveBeenCalled();
    });
  });
});
