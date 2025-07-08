import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import WeekRow from "./WeekRow";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  const currentView = new Date("2025-07-01");
  const today = new Date("2025-07-08");
  const startDate = new Date("2025-07-08");
  const endDate = new Date("2025-07-10");

  return {
    ...mod,
    useContext: vi.fn(() => ({
      currentView,
      today,
      startDate,
      endDate,
    })),
  };
});

vi.mock("../utils", async () => {
  const mod = await vi.importActual("../utils");

  return {
    ...mod,
    calculateRangePosition: vi.fn().mockReturnValue([30, 80]),
  };
});

const mockWeek = [
  new Date("2025-07-07"),
  new Date("2025-07-08"),
  new Date("2025-07-09"),
  new Date("2025-07-10"),
  new Date("2025-07-11"),
  new Date("2025-07-12"),
  new Date("2025-07-13"),
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("WeekRow", () => {
  it("renders all days of the week", () => {
    render(<WeekRow days={mockWeek} />);

    const cells = screen.getAllByRole("gridcell");

    for (const cell of cells) {
      expect(cell).toHaveTextContent(/\d\d?/);
      expect(cell.dataset.date).toMatch(/\d{4}-\d{2}-\d{2}/);
    }
  });

  it("sets the left and right of the range indicator", () => {
    render(<WeekRow days={mockWeek} />);

    expect(screen.getByTestId("range-indicator")).toHaveStyle({
      left: "30%",
      right: "80%",
    });
  });
});
