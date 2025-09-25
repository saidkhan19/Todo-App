import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { mockStoreState } from "@/utils/test-utils";
import { usePlannerStore } from "../store";
import useDragPointerHandlers from "./useDragPointerHandlers";

vi.mock("../store", () => ({
  usePlannerStore: vi.fn(),
}));

const mockStore = {
  updateDragging: vi.fn(),
  setNextWeek: vi.fn(),
  setPreviousWeek: vi.fn(),
};

const mockEvent = {
  preventDefault: vi.fn(),
  clientX: 0,
  clientY: 0,
};

const mockCellElement = {
  getAttribute: vi.fn(() => "gridcell"),
  dataset: {
    row: "0",
    column: "0",
  },
};

const mockGridElement = {
  getAttribute: vi.fn(() => "grid"),
};

const mockElement = {
  getAttribute: vi.fn(() => "some-element"),
};

const mockContentRef = {
  current: {
    getBoundingClientRect: vi.fn(),
  },
};

const mockDefaultRect = {
  top: 0,
  left: 0,
  right: 100,
  width: 100,
};

const mockProps = {
  gridContentRef: mockContentRef,
  isDragging: true,
  rowCount: 5,
};

beforeEach(() => {
  window.document.elementsFromPoint = vi.fn();
  mockStoreState(usePlannerStore, mockStore);

  mockContentRef.current.getBoundingClientRect.mockReturnValue(mockDefaultRect);
  window.document.elementsFromPoint.mockReturnValue([mockElement]);

  vi.useFakeTimers();
});

afterEach(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
});

describe("useDragPointerHandlers", () => {
  it("calls document.elementsFromPoint with correct coordinates", () => {
    const { result } = renderHook(() => useDragPointerHandlers(mockProps));

    act(() => {
      result.current({ ...mockEvent, clientX: 123, clientY: 321 });
    });

    expect(window.document.elementsFromPoint).toHaveBeenCalledWith(123, 321);
  });

  it("calls updateDragging with gridcell data when mouse is on top of a gridcell", () => {
    window.document.elementsFromPoint.mockReturnValue([
      mockElement,
      { ...mockCellElement, dataset: { row: "98", column: "78" } },
    ]);

    const { result } = renderHook(() => useDragPointerHandlers(mockProps));

    act(() => {
      result.current(mockEvent);
    });

    expect(mockStore.updateDragging).toHaveBeenCalledWith(98, 78);
  });

  describe("correctly approximates row & column when mouse outside a gridcell but within the grid", () => {
    it("sets row to '0' when mouse is above the grid", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });
      window.document.elementsFromPoint.mockReturnValue([
        mockElement,
        mockGridElement,
      ]);

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event in the left corner of the grid above items
      act(() => {
        result.current({ ...mockEvent, clientX: 51, clientY: 99 });
      });

      expect(mockStore.updateDragging).toHaveBeenCalledWith(0, 0);
    });

    it("sets last row when mouse is under the grid items", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });
      window.document.elementsFromPoint.mockReturnValue([
        mockElement,
        mockGridElement,
      ]);

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event in the left corner of the grid under items
      act(() => {
        result.current({ ...mockEvent, clientX: 51, clientY: 150 });
      });

      expect(mockStore.updateDragging).toHaveBeenCalledWith(
        mockProps.rowCount,
        0
      );
    });

    it("correctly sets the middle column", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });
      window.document.elementsFromPoint.mockReturnValue([
        mockElement,
        mockGridElement,
      ]);

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event in the middle of the grid above items
      act(() => {
        result.current({ ...mockEvent, clientX: 100, clientY: 99 });
      });

      expect(mockStore.updateDragging).toHaveBeenCalledWith(0, 3);
    });

    it("correctly sets the last column", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });
      window.document.elementsFromPoint.mockReturnValue([
        mockElement,
        mockGridElement,
      ]);

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event in the right corner of the grid above items
      act(() => {
        result.current({ ...mockEvent, clientX: 149, clientY: 99 });
      });

      expect(mockStore.updateDragging).toHaveBeenCalledWith(0, 6);
    });
  });

  describe("handles edge navigation", () => {
    it("calls setPreviousWeek when mouse is on the left side of the grid", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event on the left side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 10, clientY: 100 });
      });

      expect(mockStore.setPreviousWeek).not.toHaveBeenCalled();

      // Calls setPreviousWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setPreviousWeek).toHaveBeenCalled();

      // Never calls setNextWeek
      expect(mockStore.setNextWeek).not.toHaveBeenCalled();
    });

    it("calls setNextWeek when mouse is on the right side of the grid", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event on the right side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 160, clientY: 100 });
      });

      expect(mockStore.setNextWeek).not.toHaveBeenCalled();

      // Calls setNextWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalled();

      // Never calls setPreviousWeek
      expect(mockStore.setPreviousWeek).not.toHaveBeenCalled();
    });

    it("continues calling setNextWeek while mouse is outside the grid", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event on the right side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 160, clientY: 100 });
      });

      // Calls setNextWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalled();

      // Calls setNextWeek again every 1200ms
      act(() => {
        vi.advanceTimersByTime(1200 * 3);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(4);
    });

    it("stops calling setNextWeek when mouse comes back to the grid", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result } = renderHook(() => useDragPointerHandlers(mockProps));

      // Pointer move event on the right side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 160, clientY: 100 });
      });

      // Calls setNextWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalled();

      // Calls setNextWeek again every 1200ms
      act(() => {
        vi.advanceTimersByTime(1200);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);

      // Pointer move event within the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 100, clientY: 100 });
      });

      act(() => {
        vi.advanceTimersByTime(1200 * 3);
      });

      // Did not trigger any new calls
      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);
    });

    it("stops calling setNextWeek when isDragging becomes false", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result, rerender } = renderHook(
        (props) => useDragPointerHandlers(props),
        {
          initialProps: { ...mockProps, isDragging: true },
        }
      );

      // Pointer move event on the right side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 160, clientY: 100 });
      });

      // Calls setNextWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalled();

      // Calls setNextWeek again in 1200ms
      act(() => {
        vi.advanceTimersByTime(1200);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);

      rerender({ ...mockProps, isDragging: false });

      act(() => {
        vi.advanceTimersByTime(1200 * 3);
      });

      // Did not trigger any new calls
      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);
    });

    it("stops calling setNextWeek after unmount", () => {
      mockContentRef.current.getBoundingClientRect.mockReturnValue({
        top: 100,
        left: 50,
        right: 150,
        width: 100,
      });

      const { result, unmount } = renderHook(
        (props) => useDragPointerHandlers(props),
        {
          initialProps: { ...mockProps, isDragging: true },
        }
      );

      // Pointer move event on the right side of the grid
      act(() => {
        result.current({ ...mockEvent, clientX: 160, clientY: 100 });
      });

      // Calls setNextWeek after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalled();

      // Calls setNextWeek again in 1200ms
      act(() => {
        vi.advanceTimersByTime(1200);
      });

      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);

      unmount();

      act(() => {
        vi.advanceTimersByTime(1200 * 3);
      });

      // Did not trigger any new calls
      expect(mockStore.setNextWeek).toHaveBeenCalledTimes(2);
    });
  });
});
