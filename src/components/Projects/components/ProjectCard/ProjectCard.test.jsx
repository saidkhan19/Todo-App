import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ProjectCard from "./ProjectCard";

vi.mock("../UpdateProjectButton/UpdateProjectButton", async () => ({
  default: () => <div data-testid="update-project-btn" />,
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

const mockProject = {
  name: "Project 1",
  palette: "indigo",
  startDate: new Date(),
  endDate: new Date(),
};

describe("ProjectCard", () => {
  it("does not show spinner when isLoading is false", () => {
    render(<ProjectCard project={{ ...mockProject, isLoading: false }} />);

    expect(screen.queryByTestId("spinner-box")).not.toBeInTheDocument();
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<ProjectCard project={{ ...mockProject, isLoading: true }} />);

    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });
});
