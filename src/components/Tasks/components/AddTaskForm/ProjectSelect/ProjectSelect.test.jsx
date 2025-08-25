import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import ProjectSelect from "./ProjectSelect";
import { getColorPalette } from "@/utils/projects";
import { useProjects, useDefaultProject } from "@/hooks/queries";

const mockProjects = [
  { id: "project-1", name: "Project 1", palette: "indigo" },
  { id: "project-2", name: "Project 2", palette: "orange" },
  { id: "project-3", name: "Project 3", palette: "blue" },
];

const mockDefaultProject = {
  id: "project-0",
  name: "Project 0",
  palette: "red",
};

vi.mock("@/hooks/queries", async () => ({
  useProjects: vi.fn(),
  useDefaultProject: vi.fn(),
}));

vi.mock("@/hooks/useFirebaseErrorNotification", async () => ({
  default: vi.fn(),
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
  const mockUseProjects = vi.mocked(useProjects);
  const mockUseDefaultProject = vi.mocked(useDefaultProject);
  const mockUseFirebaseErrorNotification = vi.mocked(
    useFirebaseErrorNotification
  );
  const mockOnChange = vi.fn();

  it("shows loading spinner when projects or default project is loading", () => {
    mockUseProjects.mockReturnValue([null, true, null]);
    mockUseDefaultProject.mockReturnValue([null, false, null]);

    const { rerender } = render(<ProjectSelect />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();

    mockUseProjects.mockReturnValue([null, false, null]);
    mockUseDefaultProject.mockReturnValue([null, true, null]);
    rerender(<ProjectSelect />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("notifies about the query errors", () => {
    mockUseProjects.mockReturnValue([null, false, "Error1"]);
    mockUseDefaultProject.mockReturnValue([null, false, null]);

    const { rerender } = render(<ProjectSelect />);
    expect(mockUseFirebaseErrorNotification).toBeCalledWith("Error1");

    mockUseProjects.mockReturnValue([null, false, null]);
    mockUseDefaultProject.mockReturnValue([null, false, "Error2"]);
    rerender(<ProjectSelect />);
    expect(mockUseFirebaseErrorNotification).toBeCalledWith("Error2");
  });

  it("correctly renders the opener", () => {
    mockUseProjects.mockReturnValue([mockProjects, false, null]);
    mockUseDefaultProject.mockReturnValue([mockDefaultProject, false, null]);

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
    mockUseProjects.mockReturnValue([mockProjects, false, null]);
    mockUseDefaultProject.mockReturnValue([mockDefaultProject, false, null]);

    render(
      <ProjectSelect projectId="project-0" onChangeProject={mockOnChange} />
    );

    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveAttribute("data-value", mockDefaultProject.value);
    expect(options[0]).toHaveAttribute("data-name", mockDefaultProject.name);

    for (let i = 0; i < mockProjects.length; i++) {
      expect(options[i + 1]).toHaveAttribute(
        "data-value",
        mockProjects[i].value
      );
      expect(options[i + 1]).toHaveAttribute("data-name", mockProjects[i].name);
    }
  });

  it("passes correct props to the SelectMenu", () => {
    mockUseProjects.mockReturnValue([mockProjects, false, null]);
    mockUseDefaultProject.mockReturnValue([mockDefaultProject, false, null]);

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
