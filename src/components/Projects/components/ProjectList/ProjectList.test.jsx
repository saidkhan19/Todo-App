import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ProjectList from "./ProjectList";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { mockItems } from "@/mocks/items";
import { getProjects } from "@/utils/dataTransforms";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("../ProjectCard/ProjectCard", async () => ({
  default: ({ project }) => (
    <div data-testid={project.id} data-name={project.name} />
  ),
}));

vi.mock("../AddProjectButton/AddProjectButton", async () => ({
  default: () => <div data-testid="add-project-btn" />,
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("ProjectList", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);

  it("shows loading spinner when projects are loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
    });
    render(<ProjectList />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("does not render items when there are no items", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
    });
    render(<ProjectList />);
    // Only Add New Project button is rendered
    expect(screen.getByTestId("project-list").childElementCount).toBe(1);
  });

  it("renders items and rerenders as available items change", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: false,
    });
    const { rerender } = render(<ProjectList />);

    const projects = getProjects(mockItems);

    // Expect +1 children, the last child is Add New Project button
    expect(screen.getByTestId("project-list").childElementCount).toBe(
      projects.length + 1
    );

    projects.forEach((item) => {
      expect(screen.getByTestId(item.id)).toBeInTheDocument();
    });

    // Show only the first project
    const singleProject = [projects[0]];

    mockUseProjectsAndTasksContext.mockReturnValue({
      items: singleProject,
      loading: false,
    });
    rerender(<ProjectList />);
    expect(screen.getByTestId("project-list").childElementCount).toBe(2);
  });
});
