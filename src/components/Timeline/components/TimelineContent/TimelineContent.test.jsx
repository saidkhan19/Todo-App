import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { mockStoreState } from "@/utils/test-utils";
import { useTimelineTrackContext } from "../../context";
import useTimelineStore from "../../store";
import TimelineContent from "./TimelineContent";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
  useTransform: vi.fn(),
}));

vi.mock("../../store", async () => ({
  default: vi.fn(),
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("../TopPanel/TopPanel", async () => ({
  default: () => <div data-testid="top-panel" />,
}));

vi.mock("../TimelineTrack/TimelineTrack", async () => ({
  default: () => <div data-testid="timeline-track" />,
}));

vi.mock("../TimelineItems/TimelineItems", async () => ({
  default: () => <div data-testid="timeline-items" />,
}));

const mockTrackState = {
  x: {},
  trackHeight: 100,
  containerRef: { current: null },
};
const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);

beforeEach(() => {
  mockStoreState(useTimelineStore, { stopInteraction: vi.fn() });
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
});

afterEach(() => {
  mockTrackState.containerRef.current = null;
  vi.resetAllMocks();
});

describe("TimelineContent", () => {
  it("attaches containerRef to the timeline container", () => {
    render(<TimelineContent />);

    expect(mockTrackState.containerRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders TopPanel", () => {
    render(<TimelineContent />);

    expect(screen.queryByTestId("top-panel")).toBeInTheDocument();
  });

  it("renders TimelineTrack", () => {
    render(<TimelineContent />);

    expect(screen.queryByTestId("timeline-track")).toBeInTheDocument();
  });

  it("renders TimelineItems", () => {
    render(<TimelineContent />);

    expect(screen.queryByTestId("timeline-items")).toBeInTheDocument();
  });

  it("calls stopInteraction on component unmount", () => {
    const { unmount } = render(<TimelineContent />);
    const mockStopInteraction = useTimelineStore(
      (state) => state.stopInteraction
    );

    expect(mockStopInteraction).not.toHaveBeenCalled();

    unmount();

    expect(mockStopInteraction).toHaveBeenCalled();
  });
});
