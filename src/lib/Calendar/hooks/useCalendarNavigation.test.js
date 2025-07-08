import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useCalendarNavigation from "./useCalendarNavigation";

describe("useCalendarNavigation", () => {
  it("renders with correct default view", () => {
    const today = new Date();
    const { result } = renderHook(() => useCalendarNavigation(today));

    expect(result.current.currentView.getMonth()).toBe(today.getMonth());
    expect(result.current.currentView.getFullYear()).toBe(today.getFullYear());
  });

  it("changes to previous month correctly", () => {
    const { result } = renderHook(() =>
      useCalendarNavigation(new Date("2025-02-01"))
    );

    // getMonth() returns index, therefore one less
    expect(result.current.currentView.getMonth()).toBe(1);

    act(() => {
      result.current.setPreviousMonth();
    });

    expect(result.current.currentView.getMonth()).toBe(0);

    act(() => {
      result.current.setPreviousMonth();
    });

    expect(result.current.currentView.getFullYear()).toBe(2024);
    expect(result.current.currentView.getMonth()).toBe(11);
  });

  it("changes to next month correctly", () => {
    const { result } = renderHook(() =>
      useCalendarNavigation(new Date("2025-11-01"))
    );

    // getMonth() returns index, therefore one less
    expect(result.current.currentView.getMonth()).toBe(10);

    act(() => {
      result.current.setNextMonth();
    });

    expect(result.current.currentView.getMonth()).toBe(11);

    act(() => {
      result.current.setNextMonth();
    });

    expect(result.current.currentView.getFullYear()).toBe(2026);
    expect(result.current.currentView.getMonth()).toBe(0);
  });

  it("changes the view to the given date", () => {
    const { result } = renderHook(() =>
      useCalendarNavigation(new Date("2025-11-01"))
    );

    act(() => {
      result.current.alignView(new Date("2024-01-20"));
    });

    expect(result.current.currentView.getFullYear()).toBe(2024);
    expect(result.current.currentView.getMonth()).toBe(0);
  });

  it("does not update view if the date is within the current view", () => {
    const today = new Date("2025-11-01");
    const { result } = renderHook(() => useCalendarNavigation(today));

    act(() => {
      result.current.alignView(new Date("2025-11-20"));
    });

    expect(result.current.currentView).toBe(today);
  });
});
