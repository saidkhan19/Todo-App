import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { throttleCancel } from "throttle-debounce";
import { mockProjectItem } from "@/mocks/items";
import { isProjectVisible } from "../../utils";
import { useIsInteractingSelector } from "../../store";
import { useTimelineTrackContext } from "../../context";
import TimelineItem from "./TimelineItem";

vi.mock("throttle-debounce", async () => {
  const throttleCancel = vi.fn();
  const throttle = vi.fn((_ms, fn) => {
    fn.cancel = throttleCancel;
    return fn;
  });

  return { throttle, throttleCancel };
});

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("../../store", async () => ({
  useIsInteractingSelector: vi.fn(),
}));

vi.mock("../../utils", async () => ({
  isProjectVisible: vi.fn(),
}));

vi.mock("../TimelineCard/TimelineCard", async () => ({
  default: ({ project }) => (
    <div data-testid="timeline-card" data-id={project.id} />
  ),
}));

vi.mock("../TimelineAlignButton/TimelineAlignButton", async () => ({
  default: ({ project }) => (
    <div data-testid="timeline-align-button" data-id={project.id} />
  ),
}));

const mockUnsubscribe = vi.fn();

const mockX = {
  event: null,
  handler: null,
  on: vi.fn((event, fn) => {
    mockX.event = event;
    mockX.handler = fn;
    return mockUnsubscribe;
  }),
  get: vi.fn(),
};

const mockTrackState = {
  x: mockX,
  baseDate: new Date("2025-05-01"),
  trackSize: 10,
};

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockIsVisible = vi.mocked(isProjectVisible);
const mockIsInteracting = vi.mocked(useIsInteractingSelector);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockIsInteracting.mockReturnValue(false);
  mockX.get.mockReturnValue(100);
  mockUnsubscribe.mockClear();
  throttleCancel.mockClear();
});

afterEach(() => {
  mockX.event = null;
  mockX.handler = null;
  vi.resetAllMocks();
});

describe("TimelineItem", () => {
  it("renders timeline card when it is visible", () => {
    mockIsVisible.mockReturnValue(true);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-card")).toBeInTheDocument();
  });

  it("renders timeline card when interacting", () => {
    mockIsVisible.mockReturnValue(false);
    mockIsInteracting.mockReturnValue(true);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-card")).toBeInTheDocument();
  });

  it("renders align-button when not visible and not interacting", () => {
    mockIsVisible.mockReturnValue(false);
    mockIsInteracting.mockReturnValue(false);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-align-button")).toBeInTheDocument();
  });

  it("passes down project prop to the timeline card", () => {
    mockIsVisible.mockReturnValue(true);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-card").dataset.id).toBe(
      mockProjectItem.id
    );
  });

  it("passes down project prop to the timeline align button", () => {
    mockIsVisible.mockReturnValue(false);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-align-button").dataset.id).toBe(
      mockProjectItem.id
    );
  });

  it("updates visibility when track size changes", () => {
    mockIsVisible.mockReturnValue(true);

    const { rerender } = render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-card")).toBeInTheDocument();

    mockUseTimelineTrackContext.mockReturnValue({
      ...mockTrackState,
      trackSize: 50,
    });
    mockIsVisible.mockReturnValue(false);

    rerender(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-align-button")).toBeInTheDocument();
  });

  it("registers a change event handler on scroll", () => {
    mockIsVisible.mockReturnValue(true);
    expect(mockX.on).not.toHaveBeenCalled();
    render(<TimelineItem project={mockProjectItem} />);

    expect(mockX.on).toHaveBeenCalled();
    expect(mockX.event).toBe("change");
    expect(mockX.handler).toBeInstanceOf(Function);
  });

  it("updates visibility on scroll", () => {
    mockIsVisible.mockReturnValue(true);
    render(<TimelineItem project={mockProjectItem} />);

    expect(screen.queryByTestId("timeline-card")).toBeInTheDocument();
    expect(
      screen.queryByTestId("timeline-align-button")
    ).not.toBeInTheDocument();

    mockIsVisible.mockReturnValue(false);
    act(() => {
      // Trigger scroll event
      mockX.handler();
    });

    expect(screen.queryByTestId("timeline-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("timeline-align-button")).toBeInTheDocument();
  });

  it("clears subscriptions on unmount", () => {
    const { unmount } = render(<TimelineItem project={mockProjectItem} />);

    expect(mockUnsubscribe).not.toHaveBeenCalled();
    expect(mockX.handler.cancel).not.toHaveBeenCalled();

    unmount();

    // Unsubscribe from scroll change event
    expect(mockUnsubscribe).toHaveBeenCalled();
    // Unsubscribe from throttle
    expect(mockX.handler.cancel).toHaveBeenCalled();
  });
});
