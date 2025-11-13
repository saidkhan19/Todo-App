import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useTimelineTrackContext } from "../../context";
import { getChildren, getProgressInformation } from "@/utils/dataTransforms";
import { mockItems, mockProjectItem } from "@/mocks/items";
import TimelineCardInfoLong from "./TimelineCardInfoLong";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
  useTransform: vi.fn(),
}));

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("../../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("@/utils/dataTransforms", async () => ({
  getChildren: vi.fn(),
  getProgressInformation: vi.fn(),
}));

const mockX = {
  get: vi.fn(),
};

const mockTrackState = {
  x: mockX,
};

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
const mockGetChildren = vi.mocked(getChildren);
const mockGetProgressInformation = vi.mocked(getProgressInformation);

beforeEach(() => {
  mockUseTimelineTrackContext.mockReturnValue(mockTrackState);
  mockUseProjectsAndTasksContext.mockReturnValue(mockItems);
  mockGetProgressInformation.mockReturnValue({ overall: 10, completed: 5 });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("TimelineCardInfoLong", () => {
  it("renders progress information if project has subtasks", () => {
    mockGetChildren.mockReturnValue(mockItems);
    render(
      <TimelineCardInfoLong
        project={mockProjectItem}
        cardStartPosition={0}
        width={20}
      />
    );

    expect(screen.queryByText("timelineCardInfo")).toBeInTheDocument();
  });

  it("does not render progress information if project does not have subtasks", () => {
    mockGetChildren.mockReturnValue([]);
    render(
      <TimelineCardInfoLong
        project={mockProjectItem}
        cardStartPosition={0}
        width={20}
      />
    );

    expect(screen.queryByText("timelineCardInfo")).not.toBeInTheDocument();
  });
});
