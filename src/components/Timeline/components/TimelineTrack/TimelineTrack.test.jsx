import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { useTimelineTrackContext } from "../../context";
import { mockStoreState } from "@/utils/test-utils";
import useTimelineStore from "../../store";
import useTimelineTrackDates from "../../hooks/useTimelineTrackDates";
import TimelineTrack from "./TimelineTrack";
import { getToday } from "@/utils/date";
import { CELL_WIDTH } from "../../consts";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children, style, ...props }) => (
      <div style={style} {...props} data-transform-x={style.x}>
        {children}
      </div>
    ),
  },
}));

vi.mock("@/utils/date", async () => {
  const mod = await vi.importActual("@/utils/date");
  const mockGetToday = vi.fn();
  return {
    ...mod,
    getToday: mockGetToday,
  };
});

vi.mock("../../store", async () => ({
  default: vi.fn(),
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("../../hooks/useTimelineTrackDates", async () => ({
  default: vi.fn(),
}));

const mockTrackState = { trackHeight: 100 };
const mockNoInteractionState = {
  activeItem: null,
  activeStartDate: null,
  activeEndDate: null,
};
const mockInteractionState = {
  activeItem: { id: "item-1" },
  activeStartDate: new Date("2025-05-02"),
  activeEndDate: new Date("2025-05-05"),
};
const mockTrackDates = {
  offset: 0,
  dates: [
    new Date("2025-05-01"),
    new Date("2025-05-02"),
    new Date("2025-05-03"),
  ],
};
const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockUseTimelineTrackDates = vi.mocked(useTimelineTrackDates);
const mockGetToday = vi.mocked(getToday);

beforeEach(() => {
  mockStoreState(useTimelineStore, mockNoInteractionState);
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockGetToday.mockReturnValue(new Date("2025-05-02"));
  mockUseTimelineTrackDates.mockReturnValue(mockTrackDates);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineTrack", () => {
  it("renders all date cells", () => {
    const { container } = render(<TimelineTrack />);

    const dates = container.querySelectorAll(".date");
    expect(dates).toHaveLength(mockTrackDates.dates.length);
  });

  it("correctly labels current date", () => {
    const { container } = render(<TimelineTrack />);

    const todayCell = container.querySelector(".today");
    expect(todayCell).toBeInTheDocument();
    expect(within(todayCell).queryByText("2")).toBeInTheDocument();
  });

  it("renders range indicator when interacting", () => {
    mockStoreState(useTimelineStore, mockInteractionState);
    render(<TimelineTrack />);

    const indicator = screen.queryByTestId("range-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ width: `${4 * CELL_WIDTH}px` });
    expect(indicator.dataset.transformX).toBe(String(CELL_WIDTH));
  });

  it("does not render range indicator when not interacting", () => {
    render(<TimelineTrack />);

    expect(screen.queryByTestId("range-indicator")).not.toBeInTheDocument();
  });
});
