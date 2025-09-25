import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import Week from "../models/week";
import usePlannerStore from "./usePlannerStore";

const defaultState = {
  currentWeek: new Week(new Date("01-01-2025")),

  isDragging: false,
  dragItem: null,
  dragStartWeek: null,
  dragStartPosition: null,
  dragEndPosition: null,
  focusedItem: null,
};

const dragState = {
  ...defaultState,
  isDragging: true,
  dragItem: { id: "dragged-item" },
  dragStartWeek: defaultState.currentWeek,
  dragStartPosition: { row: 1, column: 1 },
  dragEndPosition: { row: 1, column: 1 },
  focusedItem: { id: "focused-item" },
};

describe("usePlannerStore", () => {
  beforeEach(() => {
    usePlannerStore.setState(defaultState);
  });

  it("updates currentWeek when setWeek is called", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.setWeek(new Week(new Date("02-01-2025")));
    });

    expect(result.current.currentWeek.equals(defaultState.currentWeek)).toBe(
      false
    );
  });

  it("does not update currentWeek when setWeek is called with the same week", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.setWeek(new Week(new Date("01-01-2025")));
    });

    expect(defaultState.currentWeek.equals(result.current.currentWeek)).toBe(
      true
    );
  });

  it("updates currentWeek to the next week when setNextWeek is called", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.setNextWeek();
    });

    expect(
      result.current.currentWeek.equals(defaultState.currentWeek.getNextWeek())
    );
  });

  it("updates currentWeek to the previous week when setPreviousWeek is called", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.setPreviousWeek();
    });

    expect(
      result.current.currentWeek.equals(
        defaultState.currentWeek.getPreviousWeek()
      )
    );
  });

  it("sets focusedItem when a new item is passed to setFocusedItem", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.setFocusedItem({ id: "some-item" });
    });

    expect(result.current.focusedItem).toEqual({ id: "some-item" });
  });

  it("correctly updates the store when startDragging is called", () => {
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.startDragging(1, 1, { id: "dragged-item" });
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.dragStartPosition).toEqual({ row: 1, column: 1 });
    expect(result.current.dragEndPosition).toEqual({ row: 1, column: 1 });
    expect(result.current.dragItem).toEqual({ id: "dragged-item" });
    expect(result.current.dragStartWeek).toBe(result.current.currentWeek);
  });

  it("updates dragEndPosition when updateDragging is called with new arguments", () => {
    usePlannerStore.setState(dragState);
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.updateDragging(2, 3);
    });

    expect(result.current.dragEndPosition).toEqual({ row: 2, column: 3 });
  });

  it("does not update dragEndPosition when updateDragging is called with the same agruments", () => {
    usePlannerStore.setState(dragState);
    const { result } = renderHook(() => usePlannerStore());

    act(() => {
      result.current.updateDragging(2, 3);
    });

    expect(result.current.dragEndPosition).toEqual({ row: 2, column: 3 });

    const prevDragEndPosition = result.current.dragEndPosition;

    act(() => {
      result.current.updateDragging(2, 3);
    });

    // The object did not change
    expect(result.current.dragEndPosition).toBe(prevDragEndPosition);
    // The values did not change
    expect(result.current.dragEndPosition).toEqual({ row: 2, column: 3 });
  });

  it("correctly updates the store when stopDragging is called", () => {
    usePlannerStore.setState(dragState);
    const { result } = renderHook(() => usePlannerStore());

    // Initially dragging
    expect(result.current.isDragging).toBe(true);

    act(() => {
      result.current.stopDragging();
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragStartPosition).toBeNull();
    expect(result.current.dragEndPosition).toBeNull();
    expect(result.current.dragItem).toBeNull();
    expect(result.current.dragStartWeek).toBeNull();
  });
});
