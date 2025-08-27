import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ItemCardDateForm from "./ItemCardDateForm";
import { useUpdateItem } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => {
  const mockUpdateItem = vi.fn();

  return {
    useUpdateItem: () => mockUpdateItem,
  };
});

vi.mock("@/lib/CalendarPopup", () => ({
  default: ({ startDate, endDate, onChangeStartDate, onChangeEndDate }) => {
    const handleChangeDate1 = () => {
      onChangeStartDate(new Date("2025-06-01"));
      onChangeEndDate(new Date("2025-06-30"));
    };

    const handleChangeDate2 = () => {
      onChangeStartDate(new Date("2025-06-01"));
      onChangeEndDate(new Date("2025-06-30"));
    };

    return (
      <div
        data-testid="calendar-popup"
        data-start-date={startDate.toISOString()}
        data-end-date={endDate.toISOString()}
      >
        <button
          type="button"
          data-testid="set-new-dates"
          onClick={handleChangeDate1}
        />
        <button
          type="button"
          data-testid="set-new-dates-2"
          onClick={handleChangeDate2}
        />
      </div>
    );
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("ItemCardDateForm", () => {
  const mockUpdateItem = vi.mocked(useUpdateItem());

  it("correctly renders with initial values", () => {
    render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    const calendar = screen.getByTestId("calendar-popup");
    expect(calendar.dataset.startDate).toEqual(
      new Date("2025-01-01").toISOString()
    );
    expect(calendar.dataset.endDate).toEqual(
      new Date("2025-01-30").toISOString()
    );
  });

  it("updates dates when calendar sets new dates", () => {
    render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    const calendar = screen.getByTestId("calendar-popup");

    fireEvent.click(screen.getByTestId("set-new-dates"));

    expect(calendar.dataset.startDate).toEqual(
      new Date("2025-06-01").toISOString()
    );
    expect(calendar.dataset.endDate).toEqual(
      new Date("2025-06-30").toISOString()
    );
  });

  it("syncs new date values from props on rerenders", () => {
    const { rerender } = render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    const calendar = screen.getByTestId("calendar-popup");
    expect(calendar.dataset.startDate).toEqual(
      new Date("2025-01-01").toISOString()
    );
    expect(calendar.dataset.endDate).toEqual(
      new Date("2025-01-30").toISOString()
    );

    rerender(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-06-01")}
        defaultEndDate={new Date("2025-06-30")}
      />
    );
    expect(calendar.dataset.startDate).toEqual(
      new Date("2025-06-01").toISOString()
    );
    expect(calendar.dataset.endDate).toEqual(
      new Date("2025-06-30").toISOString()
    );
  });

  it("calls 'updateItem' only after 500ms after dates change", () => {
    render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    expect(mockUpdateItem).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("set-new-dates"));

    expect(mockUpdateItem).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockUpdateItem).toHaveBeenCalled();
  });

  it("calls 'updateItem' with correct parameters", () => {
    render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    expect(mockUpdateItem).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("set-new-dates"));

    vi.advanceTimersByTime(500);

    expect(mockUpdateItem).toHaveBeenCalledWith(
      "task-1",
      expect.objectContaining({
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-30"),
      })
    );
  });

  it("calls 'updateItem' only once for mulptiple rapid updates", () => {
    render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    expect(mockUpdateItem).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("set-new-dates"));
    fireEvent.click(screen.getByTestId("set-new-dates-2"));

    expect(mockUpdateItem).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockUpdateItem).toHaveBeenCalledOnce();
  });

  it("does not call 'updateItem' when re-rendered", () => {
    const { rerender } = render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    vi.advanceTimersByTime(500);
    expect(mockUpdateItem).not.toHaveBeenCalled();

    // Re-render with different dates
    rerender(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-06-01")}
        defaultEndDate={new Date("2025-06-30")}
      />
    );
    vi.advanceTimersByTime(500);
    expect(mockUpdateItem).not.toHaveBeenCalled();

    // Re-render with same dates
    rerender(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-06-01")}
        defaultEndDate={new Date("2025-06-30")}
      />
    );
    vi.advanceTimersByTime(500);
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(
      <ItemCardDateForm
        itemId="task-1"
        defaultStartDate={new Date("2025-01-01")}
        defaultEndDate={new Date("2025-01-30")}
      />
    );

    expect(mockUpdateItem).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("set-new-dates"));

    unmount();

    expect(mockUpdateItem).not.toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
