import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import useNotificationStore from "@/store/useNotificationStore";
import UpdateProjectButton from "./UpdateProjectButton";

vi.mock("firebase/firestore", async () => {
  const mod = await vi.importActual("firebase/firestore");
  return {
    ...mod,
    updateDoc: vi.fn(),
  };
});

vi.mock("@/store/useNotificationStore", () => {
  const mockedNotify = vi.fn();

  return {
    default: () => mockedNotify,
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
  default: ({
    type,
    isOpen,
    onCancel,
    onSave,
    onDelete,
    defaultName,
    defaultIcon,
    defaultPalette,
    defaultStartDate,
    defaultEndDate,
  }) => (
    <div
      data-testid="project-form"
      data-is-open={isOpen}
      data-type={type}
      data-default-name={defaultName}
      data-default-icon={defaultIcon}
      data-default-palette={defaultPalette}
      data-default-start-date={defaultStartDate.toISOString()}
      data-default-end-date={defaultEndDate.toISOString()}
    >
      <button data-testid="delete" type="button" onClick={onDelete} />
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
  vi.mocked(updateDoc).mockReset();
  vi.clearAllMocks();
});

describe("AddProjectButton", () => {
  const mockUpdateDoc = vi.mocked(updateDoc);
  const mockNotify = vi.mocked(useNotificationStore());

  const today = (function () {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const mockProject = {
    id: "project-id",
    name: "project-1",
    icon: "folder",
    palette: "blue",
    startDate: today,
    endDate: today,
  };

  it("renders ProjectForm when 'update' button is clicked", async () => {
    const user = userEvent.setup();

    render(<UpdateProjectButton project={mockProject} />);
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Изменить" }));

    expect(screen.queryByTestId("project-form")).toBeInTheDocument();
  });

  it("hides ProjectForm when 'cancel' button is clicked", async () => {
    const user = userEvent.setup();

    render(<UpdateProjectButton project={mockProject} />);

    await user.click(screen.getByRole("button", { name: "Изменить" }));
    expect(screen.queryByTestId("project-form")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel"));
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });

  it("passes correct default values to ProjectForm", async () => {
    render(<UpdateProjectButton project={mockProject} />);

    fireEvent.click(screen.getByRole("button", { name: "Изменить" }));

    const form = screen.getByTestId("project-form");
    expect(form.dataset.type).toBe("update");
    expect(form.dataset.defaultName).toBe(mockProject.name);
    expect(form.dataset.defaultIcon).toBe(mockProject.icon);
    expect(form.dataset.defaultPalette).toBe(mockProject.palette);
    expect(form.dataset.defaultStartDate).toBe(
      mockProject.startDate.toISOString()
    );
    expect(form.dataset.defaultEndDate).toBe(mockProject.endDate.toISOString());
  });

  it("passes correct data to 'updateDoc' when saved & closes the modal", async () => {
    render(<UpdateProjectButton project={mockProject} />);

    fireEvent.click(screen.getByRole("button", { name: "Изменить" }));
    fireEvent.click(screen.getByTestId("save"));

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        startDate: mockFormData.projectStartDate,
        endDate: mockFormData.projectEndDate,
        icon: mockFormData.projectIcon,
        name: mockFormData.projectName,
        palette: mockFormData.projectPalette,
      })
    );
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });

  it("passes correct data to 'updateDoc' when 'delete' button is clicked", async () => {
    render(<UpdateProjectButton project={mockProject} />);

    fireEvent.click(screen.getByRole("button", { name: "Изменить" }));
    fireEvent.click(screen.getByTestId("delete"));

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        updatedAt: expect.any(Object),
        deleted: true,
      })
    );
  });

  it("handles FirebaseError correctly", async () => {
    mockUpdateDoc.mockImplementation(() => {
      throw new FirebaseError("error");
    });

    render(<UpdateProjectButton project={mockProject} />);

    fireEvent.click(screen.getByRole("button", { name: "Изменить" }));

    expect(mockNotify).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("save"));

    expect(mockNotify).toHaveBeenCalled();
  });
});
