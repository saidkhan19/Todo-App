import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import TopPanel from "./TopPanel";
import { usePlannerStore } from "../../store";

vi.mock("../../store", () => ({
  usePlannerStore: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("WeeklyPlanner TopPanel", () => {
  const mockUsePlannerStore = vi.mocked(usePlannerStore);
  const mockSetNextWeek = vi.fn();
  const mockSetPreviousWeek = vi.fn();
  const mockGetWeekHeader = vi.fn();

  beforeEach(() => {
    mockGetWeekHeader.mockReturnValue("Январь 2025");

    mockUsePlannerStore.mockImplementation((selector) => {
      const state = {
        currentWeek: { getWeekHeader: mockGetWeekHeader },
        setNextWeek: mockSetNextWeek,
        setPreviousWeek: mockSetPreviousWeek,
      };
      return selector(state);
    });
  });

  it("renders the week header", () => {
    render(<TopPanel />);

    expect(
      screen.queryByRole("heading", { name: "Январь 2025" })
    ).toBeInTheDocument();
  });

  it("calls setPreviousWeek when previous button clicked", () => {
    render(<TopPanel />);

    const button = screen.getByRole("button", { name: "Предыдущая неделя" });

    expect(mockSetPreviousWeek).not.toHaveBeenCalled();
    fireEvent.click(button);

    expect(mockSetPreviousWeek).toHaveBeenCalledTimes(1);
  });

  it("calls setNextWeek when next button clicked", () => {
    render(<TopPanel />);

    const button = screen.getByRole("button", { name: "Следующая неделя" });

    expect(mockSetNextWeek).not.toHaveBeenCalled();
    fireEvent.click(button);

    expect(mockSetNextWeek).toHaveBeenCalledTimes(1);
  });

  it("updates the header when it changes", () => {
    const { rerender } = render(<TopPanel />);

    expect(
      screen.queryByRole("heading", { name: "Январь 2025" })
    ).toBeInTheDocument();

    mockGetWeekHeader.mockReturnValue("Февраль 2025");

    rerender(<TopPanel />);

    expect(
      screen.queryByRole("heading", { name: "Февраль 2025" })
    ).toBeInTheDocument();
  });
});
