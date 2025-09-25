import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useBatchUpdateItems } from "@/hooks/queries";
import { mockItem, mockItems } from "@/mocks/items";
import { mockStoreState } from "@/utils/test-utils";
import { usePlannerStore } from "../store";
import useDragHandlers from "./useDragHandlers";
import Week from "../models/week";

vi.mock("zustand/shallow", () => ({
  useShallow: (callback) => callback,
}));

vi.mock("../store", () => ({
  usePlannerStore: vi.fn(),
}));

vi.mock("@/hooks/queries", () => {
  const mockBatchUpdate = vi.fn();

  return {
    useBatchUpdateItems: () => mockBatchUpdate,
  };
});

vi.mock("../models/grid", () => ({
  grid: {
    getDragEndUpdates: vi.fn(),
  },
}));

afterEach(() => {
  vi.resetAllMocks();
});

const mockDefaultArgs = [0, 0, mockItem, mockItems];

const mockDefaultState = {
  isDragging: false,
  dragStartWeek: null,
  dragItem: null,
  dragStartPosition: null,
  dragEndPosition: null,

  currentWeek: new Week(new Date("01-01-2025")),
  startDragging: vi.fn(),
  stopDragging: vi.fn(),
};

const mockDraggingState = {
  ...mockDefaultState,
  isDragging: true,
  dragItem: mockItem,
  dragStartPosition: { row: 0, column: 0 },
  dragEndPosition: { row: 0, column: 0 },

  dragStartWeek: mockDefaultState.currentWeek,
};

describe("useDragHandlers", () => {
  const mockBatchUpdate = vi.mocked(useBatchUpdateItems());

  describe("forwards correct isDragging state", () => {
    it("when isDragging is false", () => {
      mockStoreState(usePlannerStore, mockDefaultState);

      const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));
      expect(result.current.isDragging).toBe(false);
    });

    it("when isDragging is true", () => {
      mockStoreState(usePlannerStore, mockDraggingState);

      const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));
      expect(result.current.isDragging).toBe(true);
    });
  });

  it("calls startDragging with right arguments when handleDragStart is called", () => {
    mockStoreState(usePlannerStore, mockDefaultState);

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    expect(mockDefaultState.startDragging).not.toHaveBeenCalled();

    act(() => {
      result.current.handleDragStart();
    });

    expect(mockDefaultState.startDragging).toHaveBeenCalledWith(
      mockDefaultArgs[0],
      mockDefaultArgs[1],
      mockDefaultArgs[2]
    );
  });

  it("does not do anything when handleDragEnd is called when not dragging", () => {
    mockStoreState(usePlannerStore, mockDefaultState);

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockDefaultState.stopDragging).not.toHaveBeenCalled();
  });

  it("does not send updates when no change has occured on drag end", () => {
    mockStoreState(usePlannerStore, mockDraggingState);

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockDefaultState.stopDragging).toHaveBeenCalled();
  });

  it("calculates updates and sends them when the row has changed", () => {
    mockStoreState(usePlannerStore, {
      ...mockDraggingState,
      dragStartPosition: { row: 0, column: 0 },
      dragEndPosition: { row: 1, column: 0 },
    });

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
  });

  it("calculates updates and sends them when the column has changed", () => {
    mockStoreState(usePlannerStore, {
      ...mockDraggingState,
      dragStartPosition: { row: 0, column: 0 },
      dragEndPosition: { row: 0, column: 1 },
    });

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
  });

  it("calculates updates and sends them when the week has changed", () => {
    mockStoreState(usePlannerStore, {
      ...mockDraggingState,
      currentWeek: new Week(new Date("01-02-2025")),
    });

    const { result } = renderHook(() => useDragHandlers(...mockDefaultArgs));

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
  });
});
