import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useTimelineTrackContext } from "../../context";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { mockItems, mockProjectItem } from "@/mocks/items";
import TimelineItems from "./TimelineItems";
import { FirebaseError } from "firebase/app";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
  useTransform: vi.fn(),
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

vi.mock("@/components/UI/StatusMessage", async () => ({
  default: ({ type, message }) => (
    <div data-testid="status-message" data-type={type} data-message={message} />
  ),
}));

vi.mock("../TimelineItem/TimelineItem", async () => ({
  default: ({ project }) => (
    <div data-testid="timeline-item" data-id={project.id} />
  ),
}));

const mockTrackState = {
  x: {},
  trackHeight: 100,
};
const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineItems", () => {
  it("renders a spinner when items are loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });
    render(<TimelineItems />);

    expect(screen.queryByTestId("spinner-box")).toBeInTheDocument();
  });

  it("renders an error message when there is an error", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: new FirebaseError(),
    });
    render(<TimelineItems />);

    expect(screen.queryByTestId("spinner-box")).not.toBeInTheDocument();

    const message = screen.queryByTestId("status-message");
    expect(message).toBeInTheDocument();
    expect(message.dataset.type).toBe("error");
  });

  it("renders 'Not found' message when there are no items", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });
    render(<TimelineItems />);

    expect(screen.queryByTestId("spinner-box")).not.toBeInTheDocument();

    const message = screen.queryByTestId("status-message");
    expect(message).toBeInTheDocument();
    expect(message.dataset.type).toBe("info");
  });

  it("renders all projects when they are available", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: false,
      error: null,
    });

    render(<TimelineItems />);

    const items = screen.queryAllByTestId("timeline-item");
    expect(items).toHaveLength(2);
  });

  it("passes project details to TimelineItem component", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [mockProjectItem],
      loading: false,
      error: null,
    });

    render(<TimelineItems />);

    const item = screen.queryByTestId("timeline-item");
    expect(item).toBeInTheDocument();
    expect(item.dataset.id).toBe(mockProjectItem.id);
  });
});
