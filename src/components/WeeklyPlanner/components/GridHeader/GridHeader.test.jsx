import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { usePlannerStore } from "../../store";
import { getWeekdayFromMonday, isToday } from "@/utils/date";
import {
  monthBoundaryExpected,
  monthBoundaryWeekMock,
  standardWeekExpected,
  standardWeekMock,
  yearBoundaryExpected,
  yearBoundaryWeekMock,
} from "../../mocks/weeks";
import GridHeader from "./GridHeader";
import { mockStoreState } from "@/utils/test-utils";

vi.mock("../../store", () => ({
  usePlannerStore: vi.fn(),
}));

vi.mock("@/utils/date", async () => {
  const mod = await vi.importActual("@/utils/date");
  return {
    ...mod,
    isToday: vi.fn(),
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("GridHeader", () => {
  const mockIsToday = vi.mocked(isToday);

  const setCurrentWeek = (week) => {
    mockStoreState(usePlannerStore, { currentWeek: week });
  };

  const setToday = (todayIndex) => {
    mockIsToday.mockImplementation(
      (date) => getWeekdayFromMonday(date) === todayIndex
    );
  };

  const testCases = [
    {
      name: "standard week",
      week: standardWeekMock,
      expected: standardWeekExpected,
    },
    {
      name: "month boundary week",
      week: monthBoundaryWeekMock,
      expected: monthBoundaryExpected,
    },
    {
      name: "year boundary week",
      week: yearBoundaryWeekMock,
      expected: yearBoundaryExpected,
    },
  ];

  describe.each(testCases)("$name", ({ week, expected }) => {
    beforeEach(() => {
      setCurrentWeek(week);
      setToday(-1); // No "today" highlighting for basic tests
    });

    it("renders correct number of column headers", () => {
      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(7);
    });

    it("has correct ARIA attributes", () => {
      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");

      headers.forEach((el, index) => {
        expect(el).toHaveAttribute("aria-label", expected.longWeekdays[index]);
        expect(el).toHaveAttribute("aria-colindex", String(index + 1));
      });
    });

    it("displays correct dates", () => {
      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");
      headers.forEach((el, index) => {
        expect(
          within(el).queryByText(expected.dates[index])
        ).toBeInTheDocument();
      });
    });

    it("displays correct weekday abbreviations", () => {
      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");
      headers.forEach((el, index) => {
        expect(
          within(el).queryByText(expected.shortWeekdays[index])
        ).toBeInTheDocument();
      });
    });
  });

  describe("today highlighting", () => {
    const testDays = [
      { name: "Monday", index: 0 },
      { name: "Wednesday", index: 2 },
      { name: "Friday", index: 4 },
      { name: "Sunday", index: 6 },
    ];

    it.each(testDays)("highlights'$name when it is today", ({ index }) => {
      setCurrentWeek(standardWeekMock);
      setToday(index);

      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");
      const todayHeader = headers[index];

      expect(todayHeader).toHaveAttribute(
        "aria-label",
        `${standardWeekExpected.longWeekdays[index]} (Сегодня)`
      );

      const dateElement = within(todayHeader).queryByText(
        String(standardWeekExpected.dates[index])
      ).parentElement;

      expect(dateElement).toHaveClass("is-active");

      // Other days do not have is-active class
      headers.forEach((header, i) => {
        if (i !== index) {
          expect(header).toHaveAttribute(
            "aria-label",
            standardWeekExpected.longWeekdays[i]
          );
          const otherDateElement = within(header).getByText(
            String(standardWeekExpected.dates[i])
          ).parentElement;
          expect(otherDateElement).not.toHaveClass("is-active");
        }
      });
    });

    it("shows no highlighting when today is not in current week", () => {
      setCurrentWeek(standardWeekMock);
      setToday(-1); // Today is outside this week

      render(<GridHeader />);

      const headers = screen.getAllByRole("columnheader");

      headers.forEach((header, index) => {
        // Does not contain "Сегодня"
        expect(header).toHaveAttribute(
          "aria-label",
          standardWeekExpected.longWeekdays[index]
        );

        // No 'is-active' class
        const dateElement = within(header).getByText(
          String(standardWeekExpected.dates[index])
        ).parentElement;
        expect(dateElement).not.toHaveClass("is-active");
      });
    });
  });
});
