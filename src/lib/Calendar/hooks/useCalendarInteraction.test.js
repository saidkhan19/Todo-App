import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useCalendarInteraction from "./useCalendarInteraction";

vi.mock("../utils", async () => {
  const mod = await vi.importActual("../utils");
  return {
    ...mod,
    parseLocalDateString: vi.fn((dateString) => new Date(dateString)),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCalendarInteraction", () => {
  const mockProps = {
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-01-15"),
    onChangeStartDate: vi.fn(),
    onChangeEndDate: vi.fn(),
    alignView: vi.fn(),
  };

  it("calls alignView with the date when date is selected", () => {
    const { result } = renderHook(() => useCalendarInteraction(mockProps));

    const mockEvent = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-10" },
        }),
      },
    };

    expect(mockProps.alignView).not.toHaveBeenCalled();

    act(() => {
      result.current.handleDateClick(mockEvent);
    });

    expect(mockProps.alignView).toHaveBeenCalledWith(new Date("2025-01-10"));
  });

  it("correctly expands range backwards", () => {
    const { result } = renderHook(() => useCalendarInteraction(mockProps));

    const mockEvent1 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-10" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent1);
    });

    // The start is updated first time
    expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
      new Date("2025-01-10")
    );

    const mockEvent2 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2024-05-10" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent2);
    });

    // The start is updated second time
    expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
      new Date("2024-05-10")
    );

    // The end is never updated
    expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
  });

  it("correctly expands range forwards", () => {
    const { result } = renderHook(() => useCalendarInteraction(mockProps));

    const mockEvent1 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-20" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent1);
    });

    // The end is updated first time
    expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
      new Date("2025-01-20")
    );

    const mockEvent2 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2026-05-10" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent2);
    });

    // The end is updated second time
    expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
      new Date("2026-05-10")
    );

    // The start is never updated
    expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
  });

  it("narrows the range to a singe date, if selected within the range", () => {
    const { result } = renderHook(() =>
      useCalendarInteraction({
        ...mockProps,
        startDate: new Date("2025-01-10"),
        endDate: new Date("2025-01-20"),
      })
    );

    const mockEvent = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-15" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent);
    });

    // Both ends are updated to the same date
    expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
      new Date("2025-01-15")
    );
    expect(mockProps.onChangeEndDate).toHaveBeenCalledWith(
      new Date("2025-01-15")
    );
  });

  it("does not update ends when already selected date is clicked", () => {
    const { result } = renderHook(() =>
      useCalendarInteraction({
        ...mockProps,
        startDate: new Date("2025-01-10"),
        endDate: new Date("2025-01-20"),
      })
    );

    const mockEvent1 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-10" },
        }),
      },
    };
    const mockEvent2 = {
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-20" },
        }),
      },
    };

    act(() => {
      result.current.handleDateClick(mockEvent1);
      result.current.handleDateClick(mockEvent2);
    });

    expect(mockProps.onChangeStartDate).not.toHaveBeenCalled();
    expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
  });

  it("handles keyboard events", () => {
    const { result } = renderHook(() => useCalendarInteraction(mockProps));

    const mockEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
      target: {
        closest: vi.fn().mockReturnValue({
          dataset: { date: "2025-01-10" },
        }),
      },
    };

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockProps.onChangeStartDate).toHaveBeenCalledWith(
      new Date("2025-01-10")
    );
    expect(mockProps.onChangeEndDate).not.toHaveBeenCalled();
  });
});
