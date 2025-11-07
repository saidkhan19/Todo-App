import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { animate } from "motion/react";
import { useTimelineTrackContext } from "../../context";
import TimelineAlignButton from "./TimelineAlignButton";
import { mockProjectItem } from "@/mocks/items";
import { CELL_WIDTH } from "../../consts";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
  useTransform: vi.fn(),
  animate: vi.fn(),
}));

vi.mock("lucide-react", async () => {
  const mod = await vi.importActual("lucide-react");
  return {
    ...mod,
    ChevronLeft: () => <div data-testid="chevron-left" />,
    ChevronRight: () => <div data-testid="chevron-right" />,
  };
});

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

const mockX = {
  get: vi.fn(),
};

const mockTrackState = {
  x: mockX,
  baseDate: new Date("2025-05-01"),
  containerWidth: 100,
};

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockAnimate = vi.mocked(animate);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockX.get.mockReturnValue(0);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineAlignButton", () => {
  it("renders Chevron left when card is on the left", () => {
    render(
      <TimelineAlignButton
        project={{ ...mockProjectItem, startDate: new Date("2025-04-01") }}
      />
    );

    expect(screen.queryByTestId("chevron-left")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-right")).not.toBeInTheDocument();
  });

  it("renders Chevron right when card is on the right", () => {
    render(
      <TimelineAlignButton
        project={{ ...mockProjectItem, startDate: new Date("2025-06-01") }}
      />
    );

    expect(screen.queryByTestId("chevron-left")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chevron-right")).toBeInTheDocument();
  });

  it("scrolls timeline to project start position when button is clicked", () => {
    render(
      <TimelineAlignButton
        project={{ ...mockProjectItem, startDate: new Date("2025-05-02") }}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockAnimate).toHaveBeenCalledWith(
      mockX,
      -CELL_WIDTH,
      expect.any(Object)
    );
  });
});
