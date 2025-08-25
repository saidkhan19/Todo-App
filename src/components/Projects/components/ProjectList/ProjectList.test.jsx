import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ProjectList from "./ProjectList";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import { useProjects } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => ({
  useProjects: vi.fn(),
}));

vi.mock("@/hooks/useFirebaseErrorNotification", async () => ({
  default: vi.fn(),
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
  const mockUseProjects = vi.mocked(useProjects);
  const mockUseFirebaseErrorNotification = vi.mocked(
    useFirebaseErrorNotification
  );

  it("shows loading spinner when projects are loading", () => {
    mockUseProjects.mockReturnValue([null, true, null]);
    render(<ProjectList />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("notifies about an error", () => {
    mockUseProjects.mockReturnValue([null, false, "Error"]);
    render(<ProjectList />);
    expect(mockUseFirebaseErrorNotification).toBeCalledWith("Error");
  });

  it("does not render items when there are no items", () => {
    mockUseProjects.mockReturnValue([[], false, null]);
    render(<ProjectList />);
    // Only Add New Project button is rendered
    expect(screen.getByTestId("project-list").childElementCount).toBe(1);
  });

  it("renders items and rerenders as available items change", () => {
    mockUseProjects.mockReturnValue([
      [
        { id: "1", name: "Project-1" },
        { id: "2", name: "Project-2" },
        { id: "3", name: "Project-3" },
      ],
      false,
      null,
    ]);
    const { rerender } = render(<ProjectList />);
    // One extra for the Add New Project button
    expect(screen.getByTestId("project-list").childElementCount).toBe(4);
    expect(screen.getByTestId("1")).toBeInTheDocument();
    expect(screen.getByTestId("2")).toBeInTheDocument();
    expect(screen.getByTestId("3")).toBeInTheDocument();

    mockUseProjects.mockReturnValue([
      [
        { id: "1", name: "Project-1" },
        { id: "2", name: "Project-2" },
      ],
      false,
      null,
    ]);
    rerender(<ProjectList />);
    expect(screen.getByTestId("project-list").childElementCount).toBe(3);
  });
});
