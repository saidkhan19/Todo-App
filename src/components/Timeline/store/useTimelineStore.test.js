import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useTimelineStore from "./useTimelineStore";

const defaultState = {
  activeItem: null,
  interactionType: null,
  initialScrollX: null,
  interactionStartPosition: null,
  activeStartDate: null,
  activeEndDate: null,
};

const interactionState = {
  activeItem: {
    id: "item-1",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-05-10"),
  },
  interactionType: "drag",
  initialScrollX: 0,
  interactionStartPosition: 0,
};

describe("useTimelineStore", () => {
  beforeEach(() => {
    useTimelineStore.setState(defaultState);
  });

  it("updates the store when startInteraction is called", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });

    expect(result.current.activeItem).toBe(interactionState.activeItem);
    expect(result.current.interactionType).toBe(
      interactionState.interactionType
    );
    expect(result.current.initialScrollX).toBe(interactionState.initialScrollX);
    expect(result.current.interactionStartPosition).toBe(
      interactionState.interactionStartPosition
    );
    expect(result.current.activeStartDate).toBe(
      interactionState.activeItem.startDate
    );
    expect(result.current.activeEndDate).toBe(
      interactionState.activeItem.endDate
    );
  });

  it("updates activeStartDate when updateStartDate is called", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateStartDate(new Date("2025-04-01"));
    });

    expect(result.current.activeStartDate).toEqual(new Date("2025-04-01"));
  });

  it("does not update activeStartDate when updateStartDate is called with the same date", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateStartDate(
        new Date(interactionState.activeItem.startDate)
      );
    });

    // Reference did not change
    expect(result.current.activeStartDate).toBe(
      interactionState.activeItem.startDate
    );
  });

  it("updates activeEndDate when updateEndDate is called", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateEndDate(new Date("2025-06-01"));
    });

    expect(result.current.activeEndDate).toEqual(new Date("2025-06-01"));
  });

  it("does not update activeEndDate when updateEndDate is called with the same date", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateEndDate(
        new Date(interactionState.activeItem.endDate)
      );
    });

    // Reference did not change
    expect(result.current.activeEndDate).toBe(
      interactionState.activeItem.endDate
    );
  });

  it("updates both active dates when updateDates is called", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateDates(
        new Date("2025-04-01"),
        new Date("2025-06-01")
      );
    });

    expect(result.current.activeStartDate).toEqual(new Date("2025-04-01"));
    expect(result.current.activeEndDate).toEqual(new Date("2025-06-01"));
  });

  it("does not update both active dates when updateDates is called with the same dates", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.updateDates(
        new Date(interactionState.activeItem.startDate),
        new Date(interactionState.activeItem.endDate)
      );
    });

    // References did not change
    expect(result.current.activeStartDate).toBe(
      interactionState.activeItem.startDate
    );
    expect(result.current.activeEndDate).toBe(
      interactionState.activeItem.endDate
    );
  });

  it("resets the store when stopInteraction is called", () => {
    const { result } = renderHook(() => useTimelineStore());

    act(() => {
      result.current.startInteraction(interactionState);
    });
    act(() => {
      result.current.stopInteraction();
    });

    expect(result.current.activeItem).toBeNull();
    expect(result.current.interactionType).toBeNull();
    expect(result.current.initialScrollX).toBeNull();
    expect(result.current.interactionStartPosition).toBeNull();
    expect(result.current.activeStartDate).toBeNull();
    expect(result.current.activeEndDate).toBeNull();
  });
});
