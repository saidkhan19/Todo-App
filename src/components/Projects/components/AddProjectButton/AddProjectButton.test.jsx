import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddProjectButton from "./AddProjectButton";
import { useSaveItem } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => {
  const mockSaveItem = vi.fn();

  return {
    useSaveItem: () => mockSaveItem,
  };
});

const mockFormData = {
  projectStartDate: "start-date",
  projectEndDate: "end-date",
  projectIcon: "project-icon",
  projectName: "project-name",
  projectPalette: "project-palette",
};

vi.mock("../shared/ProjectForm/ProjectForm", () => ({
  default: ({ isOpen, onCancel, onSave }) => (
    <div data-testid="project-form" data-is-open={isOpen}>
      <button data-testid="cancel" type="button" onClick={onCancel} />
      <button
        data-testid="save"
        type="button"
        onClick={() => onSave(mockFormData)}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("AddProjectButton", () => {
  const mockSaveItem = vi.mocked(useSaveItem());

  it("renders ProjectForm when 'add' button is clicked", async () => {
    const user = userEvent.setup();

    render(<AddProjectButton />);
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(screen.queryByTestId("project-form")).toBeInTheDocument();
  });

  it("hides ProjectForm when 'cancel' button is clicked", async () => {
    const user = userEvent.setup();

    render(<AddProjectButton />);

    await user.click(screen.getByRole("button", { name: "Добавить" }));
    expect(screen.queryByTestId("project-form")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel"));
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });

  it("passes correct data to 'saveItem' when saved & closes the modal", async () => {
    render(<AddProjectButton />);

    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));
    fireEvent.click(screen.getByTestId("save"));

    expect(mockSaveItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "project",
        level: 0,
        startDate: mockFormData.projectStartDate,
        endDate: mockFormData.projectEndDate,
        icon: mockFormData.projectIcon,
        name: mockFormData.projectName,
        palette: mockFormData.projectPalette,
      })
    );
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });
});
