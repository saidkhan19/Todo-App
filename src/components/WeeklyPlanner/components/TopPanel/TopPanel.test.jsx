import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import TopPanel from "./TopPanel";
import { usePlannerStore } from "../../store";
import Week from "../../models/week";
import { mockStoreState } from "@/utils/test-utils";

vi.mock("../../store", () => ({
  usePlannerStore: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("WeeklyPlanner TopPanel", () => {
  const mockSetNextWeek = vi.fn();
  const mockSetPreviousWeek = vi.fn();

  beforeEach(() => {
    mockStoreState(usePlannerStore, {
      currentWeek: new Week(new Date("01-15-2025")),
      setNextWeek: mockSetNextWeek,
      setPreviousWeek: mockSetPreviousWeek,
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

    mockStoreState(usePlannerStore, {
      currentWeek: new Week(new Date("02-15-2025")),
      setNextWeek: mockSetNextWeek,
      setPreviousWeek: mockSetPreviousWeek,
    });

    rerender(<TopPanel />);

    expect(
      screen.queryByRole("heading", { name: "Февраль 2025" })
    ).toBeInTheDocument();
  });
});
