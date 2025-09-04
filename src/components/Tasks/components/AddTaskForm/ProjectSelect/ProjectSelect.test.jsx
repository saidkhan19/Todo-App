import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ProjectSelect from "./ProjectSelect";
import { getColorPalette } from "@/utils/projects";
import { mockItems } from "@/mocks/items";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { getProjects } from "@/utils/dataTransforms";

const mockDefaultProject = {
  id: "project-0",
  name: "Project 0",
  palette: "red",
};

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("@/components/DataProviders/DefaultProjectProvider", async () => ({
  useDefaultProjectContext: vi.fn(),
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

vi.mock("@/lib/Menu", async () => ({
  default: ({ title, renderOpener, renderContent }) => (
    <div>
      <div data-testid="title">{title}</div>
      <div data-testid="opener">{renderOpener()}</div>
      <div data-testid="content">{renderContent()}</div>
    </div>
  ),
}));

vi.mock("@/lib/SelectMenu", async () => ({
  default: ({ options, selected, onChange }) => (
    <div>
      <div data-testid="selected" data-selected={selected} />
      <div data-testid="options" role="listbox">
        {options.map((item) => (
          <li
            key={item.value}
            role="option"
            data-value={item.value}
            data-name={item.name}
          />
        ))}
      </div>
      <button
        data-testid="change-to-project-2"
        onClick={() => onChange("project-2")}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("ProjectSelect", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockUseDefaultProjectContext = vi.mocked(useDefaultProjectContext);
  const mockOnChange = vi.fn();

  it("shows loading spinner when projects or default project is loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
    });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: null,
      loading: true,
    });

    const { rerender } = render(<ProjectSelect />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();

    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
    });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockDefaultProject,
      loading: false,
    });
    rerender(<ProjectSelect />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("correctly renders the opener", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: false,
    });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockDefaultProject,
      loading: false,
    });

    render(
      <ProjectSelect projectId="project-0" onChangeProject={mockOnChange} />
    );

    const opener = screen.getByRole("combobox");
    expect(opener).toHaveTextContent(mockDefaultProject.name);

    const palette = getColorPalette(mockDefaultProject.palette);
    expect(opener).toHaveStyle({
      backgroundColor: palette.soft,
      color: palette.primary,
    });
  });

  it("renders SelectMenu with the correct format of options", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: false,
    });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockDefaultProject,
      loading: false,
    });

    render(
      <ProjectSelect projectId="project-0" onChangeProject={mockOnChange} />
    );

    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveAttribute("data-value", mockDefaultProject.value);
    expect(options[0]).toHaveAttribute("data-name", mockDefaultProject.name);

    const mockProjects = getProjects(mockItems);

    for (let i = 0; i < mockProjects.length; i++) {
      expect(options[i + 1]).toHaveAttribute(
        "data-value",
        mockProjects[i].value
      );
      expect(options[i + 1]).toHaveAttribute("data-name", mockProjects[i].name);
    }
  });

  it("passes correct props to the SelectMenu", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: false,
    });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockDefaultProject,
      loading: false,
    });

    render(
      <ProjectSelect projectId="project-0" onChangeProject={mockOnChange} />
    );

    expect(screen.getByTestId("selected")).toHaveAttribute(
      "data-selected",
      "project-0"
    );

    expect(mockOnChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("change-to-project-2"));

    expect(mockOnChange).toHaveBeenCalledWith("project-2");
  });
});
