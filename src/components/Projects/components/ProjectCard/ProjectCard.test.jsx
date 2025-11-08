import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ProjectCard from "./ProjectCard";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getChildren, getProgressInformation } from "@/utils/dataTransforms";
import { mockItems } from "@/mocks/items";

vi.mock("react-router", async () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("../CircleChip", async () => ({
  default: ({ isLoading }) => (
    <div data-testid="chip" data-is-loading={isLoading} />
  ),
}));

vi.mock("../UpdateProjectButton/UpdateProjectButton", async () => ({
  default: () => <div data-testid="update-project-btn" />,
}));

vi.mock("@/components/UI/ProgressBar", async () => ({
  default: () => <div data-testid="progress-bar" />,
}));

vi.mock("@/utils/dataTransforms", async () => ({
  getChildren: vi.fn(),
  getProgressInformation: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const mockProject = {
  name: "Project 1",
  palette: "indigo",
  startDate: new Date(),
  endDate: new Date(),
  isLoading: false,
};

describe("ProjectCard", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockGetChildren = vi.mocked(getChildren);
  const mockGetProgressInformation = vi.mocked(getProgressInformation);

  beforeEach(() => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: [] });
    mockGetChildren.mockReturnValue([]);
    mockGetProgressInformation.mockReturnValue({ completed: 5, overall: 10 });
  });

  it("passes correct loading prop when false", () => {
    render(<ProjectCard project={{ ...mockProject, isLoading: false }} />);

    const chip = screen.queryByTestId("chip");
    expect(chip).toBeInTheDocument();
    expect(chip.dataset.isLoading).toBe("false");
  });

  it("passes correct loading prop when true", () => {
    render(<ProjectCard project={{ ...mockProject, isLoading: true }} />);

    const chip = screen.queryByTestId("chip");
    expect(chip).toBeInTheDocument();
    expect(chip.dataset.isLoading).toBe("true");
  });

  it("does not render progress bar when it project has no subtasks", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
  });

  it("renders progress bar when project has subtasks", () => {
    mockGetChildren.mockReturnValue(mockItems);
    render(<ProjectCard project={mockProject} />);

    expect(screen.queryByTestId("progress-bar")).toBeInTheDocument();
  });

  it("renders a link to the tasks page with correct search parameters", () => {
    render(<ProjectCard project={mockProject} />);

    const link = screen.queryByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      `/tasks?action=add-task&project=${mockProject.id}`
    );
  });
});
