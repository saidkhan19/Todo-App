import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { mockProjectItem } from "@/mocks/items";
import { useActiveDatesSelector, useIsInteractingSelector } from "../../store";
import { useTimelineTrackContext } from "../../context";
import useTimelineCardInteractions from "../../hooks/useTimelineCardInteractions";
import TimelineCard from "./TimelineCard";
import { CELL_WIDTH } from "../../consts";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ style, children }) => (
      <div data-transform-x={style.x} style={style}>
        {children}
      </div>
    ),
  },
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("../../store", async () => ({
  useIsInteractingSelector: vi.fn(),
  useActiveDatesSelector: vi.fn(),
}));

vi.mock("../../hooks/useTimelineCardInteractions", async () => ({
  default: vi.fn(),
}));

vi.mock("./TimelineCardInfoShort", async () => ({
  default: ({ project }) => (
    <div data-testid="info-short" data-id={project.id} />
  ),
}));

vi.mock("./TimelineCardInfoLong", async () => ({
  default: ({ project, cardStartPosition, width }) => (
    <div
      data-testid="info-long"
      data-id={project.id}
      data-start-position={cardStartPosition}
      data-width={width}
    />
  ),
}));

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockIsInteracting = vi.mocked(useIsInteractingSelector);
const mockUseActiveDates = vi.mocked(useActiveDatesSelector);
const mockUseTimlineCardInteractions = vi.mocked(useTimelineCardInteractions);

const mockTrackState = {
  baseDate: new Date("2025-05-01"),
};

const mockActiveDates = {
  startDate: new Date("2025-05-07"),
  endDate: new Date("2025-05-10"),
};

const mockHandlers = {
  handlePointerDownResizeLeft: vi.fn(),
  handlePointerDownResizeRight: vi.fn(),
  handlePointerDownDrag: vi.fn(),
  handlePointerMove: vi.fn(),
  handlePointerUp: vi.fn(),
};

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockIsInteracting.mockReturnValue(false);
  mockUseActiveDates.mockReturnValue(mockActiveDates);
  mockUseTimlineCardInteractions.mockReturnValue(mockHandlers);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineCard", () => {
  it("attaches all pointer down handlers", () => {
    render(<TimelineCard project={mockProjectItem} />);

    expect(mockHandlers.handlePointerDownDrag).not.toHaveBeenCalled();
    expect(mockHandlers.handlePointerDownResizeLeft).not.toHaveBeenCalled();
    expect(mockHandlers.handlePointerDownResizeRight).not.toHaveBeenCalled();

    fireEvent.pointerDown(
      screen.queryByRole("button", { name: "controls.moveProject" })
    );

    expect(mockHandlers.handlePointerDownDrag).toHaveBeenCalled();

    fireEvent.pointerDown(
      screen.queryByRole("button", { name: "controls.editStartDate" })
    );

    expect(mockHandlers.handlePointerDownResizeLeft).toHaveBeenCalled();

    fireEvent.pointerDown(
      screen.queryByRole("button", { name: "controls.editEndDate" })
    );

    expect(mockHandlers.handlePointerDownResizeRight).toHaveBeenCalled();
  });

  describe("when width is short", () => {
    const shortSpanProject = {
      ...mockProjectItem,
      startDate: new Date("2025-05-05"),
      endDate: new Date("2025-05-05"),
    };

    it("renders short info", () => {
      render(<TimelineCard project={shortSpanProject} />);
      expect(screen.queryByTestId("info-short")).toBeInTheDocument();
    });

    it("passes project prop to the short info component", () => {
      render(<TimelineCard project={shortSpanProject} />);
      expect(screen.queryByTestId("info-short").dataset.id).toBe(
        mockProjectItem.id
      );
    });
  });

  describe("when width is long", () => {
    const longSpanProject = {
      ...mockProjectItem,
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-05-05"),
    };
    it("renders long info", () => {
      render(<TimelineCard project={longSpanProject} />);
      expect(screen.queryByTestId("info-long")).toBeInTheDocument();
    });

    it("passes correct props to the long info component", () => {
      render(<TimelineCard project={longSpanProject} />);

      const info = screen.queryByTestId("info-long");
      expect(info.dataset.id).toBe(mockProjectItem.id);
      expect(info.dataset.startPosition).toBe(String(0));
      expect(info.dataset.width).toBe(String(5 * CELL_WIDTH));
    });
  });

  describe("when interacting", () => {
    beforeEach(() => {
      mockIsInteracting.mockReturnValue(true);
    });

    it("attaches pointer move & pointer up handlers to the document", () => {
      const { container } = render(<TimelineCard project={mockProjectItem} />);

      expect(mockHandlers.handlePointerMove).not.toHaveBeenCalled();
      fireEvent.pointerMove(container);
      expect(mockHandlers.handlePointerMove).toHaveBeenCalled();

      expect(mockHandlers.handlePointerUp).not.toHaveBeenCalled();
      fireEvent.pointerUp(container);
      expect(mockHandlers.handlePointerUp).toHaveBeenCalled();
    });

    it("removes event listeners on unmount", () => {
      const { container, unmount } = render(
        <TimelineCard project={mockProjectItem} />
      );

      unmount();

      fireEvent.pointerMove(container);
      fireEvent.pointerUp(container);
      expect(mockHandlers.handlePointerMove).not.toHaveBeenCalled();
      expect(mockHandlers.handlePointerUp).not.toHaveBeenCalled();
    });

    it("uses active dates", () => {
      render(<TimelineCard project={mockProjectItem} />);

      const info = screen.queryByTestId("info-long");
      expect(info.dataset.startPosition).toBe(String(6 * CELL_WIDTH));
      expect(info.dataset.width).toBe(String(4 * CELL_WIDTH));
    });

    it("disables all the buttons", () => {
      render(<TimelineCard project={mockProjectItem} />);

      expect(
        screen.queryByRole("button", { name: "controls.moveProject" })
      ).toBeDisabled();
      expect(
        screen.queryByRole("button", { name: "controls.editStartDate" })
      ).toBeDisabled();
      expect(
        screen.queryByRole("button", { name: "controls.editEndDate" })
      ).toBeDisabled();
    });
  });

  describe("when not interacting", () => {
    it("uses default project dates", () => {
      render(
        <TimelineCard
          project={{
            ...mockProjectItem,
            startDate: new Date("2025-05-01"),
            endDate: new Date("2025-05-02"),
          }}
        />
      );

      const info = screen.queryByTestId("info-long");
      expect(info.dataset.startPosition).toBe(String(0));
      expect(info.dataset.width).toBe(String(2 * CELL_WIDTH));
    });
  });
});
